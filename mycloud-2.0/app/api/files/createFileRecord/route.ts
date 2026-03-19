import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const {fileName, fileType, fileSize, folderId} = await req.json();

    if (!session) {
        return NextResponse.json(
        { errMessage: `Upload of file: ${fileName} failed`},
        { status: 401 }
        );
    }

    try {
        const file = await prisma.$transaction(async (tx) => {
            const file = await tx.file.create({
                data: {
                    name: fileName,
                    userId: session.user.id,
                    type: fileType,
                    size: fileSize,
                    uploadedAt: new Date(),
                    folderId: folderId ? Number(folderId) : null
                },
            });

            await tx.user.update({
                where: {id: session.user.id},
                data: {takenSpace: {increment: file.size}}
            });

            return file;
        });

        return NextResponse.json({ message: "Record created succesfully", id: file.id }, {status: 201});
    } catch (err) {
        return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`}, {status: 500});
    }
}
