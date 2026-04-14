import path from "path";
import { DBFile, DBFolder } from "../types";
import prisma from "./prisma";

export const deriveFilePath = async (folderStackIDs: number[], fileName: string, userId: string): Promise<string | null> => {
    const folders = await prisma.folder.findMany({
        where: {id : {in: folderStackIDs}, userId: userId}
    });


    if (folders.length !== folderStackIDs.length) return null;
    const orderedFolders = folderStackIDs.map((id: number) => folders.find(f => f.id === id)!);

    return path.join(process.env.FILE_STORAGE_PATH!, userId.toString(), orderedFolders.reduce((folderPath: string, folder: DBFolder) => path.join(folderPath, path.basename(folder.name)), ""), path.basename(fileName));
}

export const getFullPath = async (file: DBFile | DBFolder, userId: string, folderMap?: Map<number, DBFolder>): Promise<string | null> => {
    if (!folderMap) {
        let allFolders;
        try {
            allFolders = await prisma.folder.findMany({
                where: {userId: userId}
            });
        } catch (err) {
            return null;
        }

        folderMap = new Map(allFolders.map(f => [f.id, f]));
    }

    const parts: string[] = [path.basename(file.name)];
    let currentFolderId = file.folderId;

    while (currentFolderId !== null) {
        const folder = folderMap.get(currentFolderId);
        if (!folder) break;
        parts.unshift(path.basename(folder.name));
        currentFolderId = folder.folderId;
    }

    return path.join(process.env.FILE_STORAGE_PATH!, userId.toString(), ...parts);
};
