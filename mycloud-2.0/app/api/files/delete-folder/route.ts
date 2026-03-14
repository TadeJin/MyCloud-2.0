import prisma from "@/app/lib/prisma";;
import { getServerSession } from "next-auth";
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
    await deleteFolder(folderId, basePath);
    

    return NextResponse.json({ message: "Folder removed" });
}


const deleteFolder = async (folderId: number, basePath: string) => {
    const files = await prisma.file.findMany({
        where: {folderId: folderId}
    });

    await Promise.all(files.map(file => unlink(path.join(basePath, file.name))));

    await prisma.file.deleteMany({
        where: {folderId: folderId}
    });

    const subFolders = await prisma.folder.findMany({
        where: {folderId: folderId}
    });

    await Promise.all(subFolders.map(folder => deleteFolder(folder.id, basePath)));

    await prisma.folder.delete({
        where: {id: folderId}
    });
}
