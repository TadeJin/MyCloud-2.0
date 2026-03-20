import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const folderId = req.nextUrl.searchParams.get('folderId');

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    try {
        const files = await prisma.file.findMany({
            where: {
                userId: session.user.id,
                folderId: folderId ? Number(folderId) : null
            },
        });

        const convertedFiles = files.map((file) => ({...file, size: Number(file.size)}));

        return NextResponse.json(convertedFiles);
    } catch (err) {
        return NextResponse.json({ errMessage: "Error fetching files" }, {status: 500});
    }
}
