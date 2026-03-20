import prisma from "@/app/lib/prisma";;
import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import path from "path";
import { unlink } from "fs/promises";

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
        await deleteFolder(folderId, basePath, session);
    } catch (err) {
        return NextResponse.json({ errMessage: "Error removing folder" }, {status: 500});
    }
    

    return NextResponse.json({ message: "Folder removed" });
}


const deleteFolder = async (folderId: number, basePath: string, session: Session) => {
    const files = await prisma.file.findMany({
        where: {folderId: folderId}
    });

    let totalFileSize = 0;

    files.forEach((file) => {
        totalFileSize += Number(file.size);
    });

    await Promise.all(files.map(file => unlink(path.join(basePath, file.name))));

    await prisma.file.deleteMany({
        where: {folderId: folderId, userId: session.user.id}
    });

    await prisma.user.update({
        where: {id: session.user.id},
        data: {takenSpace: {decrement: totalFileSize}}
    })

    const subFolders = await prisma.folder.findMany({
        where: {folderId: folderId, userId: session.user.id}
    });

    await Promise.all(subFolders.map(folder => deleteFolder(folder.id, basePath, session)));

    await prisma.folder.delete({
        where: {id: folderId, userId: session.user.id}
    });
}
