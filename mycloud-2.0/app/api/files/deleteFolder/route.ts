import prisma from "@/app/lib/prisma";;
import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import path from "path";
import { unlink } from "fs/promises";

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const {folderId, userId} = await req.json();

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    if (session.user.id !== userId) {
        return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 401 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
         return NextResponse.json(
        { error: "Invalid path" },
        { status: 401 }
        );
    }

    const basePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString());
    await deleteFolder(folderId, basePath, session);
    

    return NextResponse.json({ message: "Folder removed" });
}


const deleteFolder = async (folderId: number, basePath: string, session: Session) => {
    const files = await prisma.file.findMany({
        where: {folderId: folderId}
    });

    let totalFileSize = 0;

    files.forEach((file) => {
        totalFileSize += file.size;
    });

    await Promise.all(files.map(file => unlink(path.join(basePath, file.name))));

    await prisma.file.deleteMany({
        where: {folderId: folderId}
    });

    await prisma.user.update({
        where: {id: session.user.id},
        data: {takenSpace: {decrement: totalFileSize}}
    })

    const subFolders = await prisma.folder.findMany({
        where: {folderId: folderId}
    });

    await Promise.all(subFolders.map(folder => deleteFolder(folder.id, basePath, session)));

    await prisma.folder.delete({
        where: {id: folderId}
    });
}
