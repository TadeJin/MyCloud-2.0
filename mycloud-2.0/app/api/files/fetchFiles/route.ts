import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { stat } from "node:fs/promises";
import { getFileFullPath } from "@/app/lib/fileHelpers";


export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const folderId = req.nextUrl.searchParams.get('folderId');
    const searchString = req.nextUrl.searchParams.get('search');
    const filter = req.nextUrl.searchParams.get('filter');

    if (!session) {
        return NextResponse.json(
            { errMessage: "No session set" },
            { status: 401 }
        );
    }

    if (!filter) {
        return NextResponse.json(
            { errMessage: "Filter not set" },
            { status: 400 }
        );
    }

    const typeMap: Record<string, string> = {
        Pictures: "image",
        Videos: "video",
        Documents: "application",
        Other: ""
    };

    try {
        const [user, allFolders] = await Promise.all([
            prisma.user.findUnique({ where: { id: session.user.id } }),
            prisma.folder.findMany({ where: { userId: session.user.id } }),
        ]);

        if (!user) return NextResponse.json({ errMessage: "Error fetching files" }, {status: 404});

        const files = await prisma.file.findMany({
            where: {
                name: { contains: searchString ? searchString : "" },
                userId: session.user.id,
                ...(!searchString && { folderId: folderId ? Number(folderId) : null }),
                ...(filter && filter !== "All" && { type: { startsWith: typeMap[filter] } }),
            },
            orderBy: {[user.sortPreference]: "asc"}
        });

        const folderMap = new Map(allFolders.map(f => [f.id, f]));

        const convertedFiles = await Promise.all(files.map(async (file) => {
            const filePath = getFileFullPath(folderMap, file, session.user.id);
            const fileStat = await stat(filePath).catch(() => null);
            return {
                ...file,
                size: Number(file.size),
                isCorrupted: fileStat === null || fileStat.size !== Number(file.size)
            };
        }));

        return NextResponse.json(convertedFiles);
    } catch (err) {
        return NextResponse.json({ errMessage: "Error fetching files" }, {status: 500});
    }
}
