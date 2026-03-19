import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const POST = async (req: NextRequest) => {
    const {fileName, fileType, fileSize, folderId} = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    await prisma.file.create({
        data: {
            name: fileName,
            userId: session.user.id,
            type: fileType,
            size: fileSize,
            uploadedAt: new Date(),
            folderId: folderId ? Number(folderId) : null
        },
    });

    return NextResponse.json({ message: "Record created succesfully" }, {status: 201});
}
