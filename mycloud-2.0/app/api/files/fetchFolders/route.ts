import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

export const GET = async (req: NextRequest) => {
    const session = await auth.api.getSession({ headers: await headers() });
    const folderId = req.nextUrl.searchParams.get('folderId');
    const searchString = req.nextUrl.searchParams.get('search');

    if (!session) {
        return NextResponse.json(
        { errMessage: "No session set" },
        { status: 401 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json(
                { errMessage: "No user found" },
                { status: 404 }
            );
        }

        const folders = await prisma.folder.findMany({
            where: {
                name: {contains: searchString ? searchString : ""},
                userId: session.user.id,
                folderId: folderId ? Number(folderId) : null
            },
            orderBy: {[user.sortPreference === "uploadedAt" ? "createdAt" : "name"]: "asc"}
        });

        return NextResponse.json(folders);
    } catch(err) {
        return NextResponse.json({ errMessage: "Error fetching folders" }, {status: 500});
    }
}
