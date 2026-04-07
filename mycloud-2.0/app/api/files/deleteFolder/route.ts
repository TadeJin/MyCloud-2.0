import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { rm } from "fs/promises";
import { getFilePath } from "@/app/lib/fileHelpers";
import { DBFile, DBFolder } from "@/app/types";


export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const {folderId, folderStackIDs} = await req.json();

    if (!session) {
        return NextResponse.json(
        { errMessage: "Error removing folder" },
        { status: 401 }
        );
    }

    const folder = await prisma.folder.findFirst({
        where: {id: folderId, userId: session.user.id}
    })

    if (!folder) {
        return NextResponse.json({ errMessage: "Folder not found" }, {status: 404});
    }

    try {
        const folderPath = await getFilePath(folderStackIDs, folder.name, session.user.id);
        if (!folderPath) return NextResponse.json({ errMessage: "Error removing folder" }, {status: 500});

        await rm(folderPath, { recursive: true, force: true })
    } catch (err) {
        return NextResponse.json({ errMessage: "Error removing folder" }, {status: 500});
    }

    try {
        const folders = [folder];
        await getSubfolders(folderId, folders, session.user.id);


        const files = await prisma.file.findMany({
            where: {folderId: {in: folders.map((folder: DBFolder) => folder.id)}, userId: session.user.id}
        });

        const totalSize = files.reduce((acc, file: DBFile) => acc + Number(file.size), 0);

        await prisma.$transaction(async (tx) => {
            await tx.folder.delete({
                where: {id: folderId, userId: session.user.id}
            });

            await tx.file.deleteMany({
                where: {id: {in: files.map((file: DBFile) => file.id)}, userId: session.user.id}
            });
            
            await tx.user.update({
                where: {id: session.user.id},
                data: {takenSpace: {decrement: totalSize}}
            });

        });

        return NextResponse.json({ message: "Folder deleted successfully" });
    } catch (err) {
        return NextResponse.json({ errMessage: "Error removing folder" }, {status: 500});
    }
}


const getSubfolders = async (folderId: number, folders: DBFolder[], userId: number) => {
    const subfolders = await prisma.folder.findMany({
        where: {folderId: folderId, userId: userId}
    });

    folders.push(...subfolders);
    await Promise.all(subfolders.map(folder => getSubfolders(folder.id, folders, userId)));
}
