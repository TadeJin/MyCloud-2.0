import prisma from "@/app/lib/prisma";
import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import path from "path";
import { unlink } from "fs/promises";
import { DBFile, DBFolder } from "@/app/types";

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const {folderId} = await req.json();

    if (!session) {
        return NextResponse.json(
        { errMessage: "Error removing folder" },
        { status: 401 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
         return NextResponse.json(
        { errMessage: "Error removing folder" },
        { status: 500 }
        );
    }

    const folder = await prisma.folder.findFirst({
        where: {id: folderId, userId: session.user.id}
    })

    if (!folder) {
        return NextResponse.json({ errMessage: "Folder not found" }, {status: 404});
    }

    try {
        const basePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString());
        const files: DBFile[] = [];
        const folderIds: number[] = [folderId];
        await getFilesPlusSubfolders(folderId, basePath, session, files, folderIds);

        const fileIds: number[] = [];
        let totalSize = 0;

        files.forEach(file => {
            fileIds.push(file.id);
            totalSize += Number(file.size);
        });

        await prisma.$transaction(async (tx) => {
            await tx.file.deleteMany({
                where: {id: {in: fileIds}, userId: session.user.id}
            });

            await tx.folder.deleteMany({
                where: {id: {in: folderIds}, userId: session.user.id}
            });

            await tx.user.update({
                where: {id: session.user.id},
                data: {takenSpace: {decrement: totalSize}}
            })
        });

        await Promise.all(files.map(file =>
            unlink(path.join(basePath, path.basename(file.name)))
        ));

        return NextResponse.json({ message: "Folder removed" });
    } catch (err) {
        return NextResponse.json({ errMessage: "Error removing folder" }, {status: 500});
    }
}


const getFilesPlusSubfolders = async (folderId: number, basePath: string, session: Session, files: DBFile[], folderIds: number[]) => {

    const subFiles = await prisma.file.findMany({
        where: {folderId: folderId, userId: session.user.id}
    });

    const subFolders = await prisma.folder.findMany({
        where: {folderId: folderId, userId: session.user.id}
    });

    subFiles.forEach((file: DBFile) => {
        files.push(file);
    });

    await Promise.all(subFolders.map(async (folder: DBFolder) => {
        folderIds.push(folder.id);
        await getFilesPlusSubfolders(folder.id, basePath, session, files, folderIds);
    }));
}
