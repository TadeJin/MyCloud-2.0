import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { statfs } from "fs/promises";
import path from "path";

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const {fileName, fileType, fileSize, folderId} = await req.json();

    if (!session) {
        return NextResponse.json(
        { errMessage: `Upload of file: ${fileName} failed`},
        { status: 401 }
        );
    }

    const sanitizedFileName = path.basename(fileName);

    try {
        const diskStats = await statfs(process.env.FILE_STORAGE_PATH!);
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user || (Number(fileSize) > (diskStats.bavail * diskStats.bsize)) || (Number(user.maxStorage) !== -1 && (Number(fileSize) + Number(user.takenSpace) > Number(user.maxStorage)))) {
            return NextResponse.json(
                { errMessage: `Upload of file: ${sanitizedFileName} failed`},
                { status: 500 }
            );
        }

        const file = await prisma.$transaction(async (tx) => {
            const file = await tx.file.create({
                data: {
                    name: sanitizedFileName,
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
        return NextResponse.json({ errMessage: `Upload of file: ${sanitizedFileName} failed`}, {status: 500});
    }
}
