import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { statfs } from "fs/promises";
import path from "path";

export const POST = async (req: NextRequest) => {
    const session = await auth.api.getSession({ headers: await headers() });
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
