import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const folderId = req.nextUrl.searchParams.get('folderId');
    const searchString = req.nextUrl.searchParams.get('search');

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    try {
        const folders = await prisma.folder.findMany({
            where: {
                name: {contains: searchString ? searchString : ""},
                userId: session?.user.id,
                folderId: folderId ? Number(folderId) : null
            },
        });

        return NextResponse.json(folders);
    } catch(err) {
        return NextResponse.json({ errMessage: "Error fetching folders" }, {status: 500});
    }
}
