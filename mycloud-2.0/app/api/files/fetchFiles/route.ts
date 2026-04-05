import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import path from "node:path";
import { stat } from "node:fs/promises";


export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const folderId = req.nextUrl.searchParams.get('folderId');
    const searchString = req.nextUrl.searchParams.get('search');
    const filter = req.nextUrl.searchParams.get('filter');

    if (!session) {
        return NextResponse.json(
            { error: "No session set" },
            { status: 401 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
            { error: "File storage not set" },
            { status: 500 }
        );
    }

    if (!filter) {
        return NextResponse.json(
            { error: "Filter not set" },
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
        const basePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString())

        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json(
                { error: "No user found" },
                { status: 404 }
            );
        }

        const files = await prisma.file.findMany({
            where: {
                name: {contains: searchString ? searchString : ""},
                userId: session.user.id,
                ...(!searchString && { folderId: folderId ? Number(folderId) : null }),
                ...(filter && filter !== "All" && { type: {startsWith: typeMap[filter]} })
            },
            orderBy: {[user.sortPreference]: "asc"}
        });

        const convertedFiles = await Promise.all(files.map(async (file) => ({...file, size: Number(file.size), isCorrupted: Number(file.size) !== (await stat(path.join(basePath, file.name))).size})));

        return NextResponse.json(convertedFiles);
    } catch (err) {
        return NextResponse.json({ errMessage: "Error fetching files" }, {status: 500});
    }
}
