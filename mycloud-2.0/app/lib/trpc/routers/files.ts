import z from "zod";
import prisma from "../../prisma";
import { createTRPCRouter, protectedFileProcedure, protectedFolderProcedure, protectedProcedure } from "../init";
import { filterOptions, folderIdType, folderStackIDsType, safeName } from "../../validators";
import { getFileFullPath, getFilePath } from "../../fileHelpers";
import { mkdir, rename, rm, stat, statfs, unlink } from "fs/promises";
import { TRPCError } from "@trpc/server";
import path from "path";
import { existsSync } from "fs";
import { DBFile, DBFolder } from "@/app/types";
import { typeMap } from "@/app/constants";

const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;

export const fileRouter = createTRPCRouter({
    fetchFiles: protectedProcedure
    .input(z.object({ searchString: z.string(), filter: filterOptions, folderId: folderIdType}))
    .query(async ({ input, ctx }) => {

       try {
        const {searchString, filter, folderId} = input;

        const allFolders = await prisma.folder.findMany({ 
            where: { userId: ctx.user.id }
        });

        const files = await prisma.file.findMany({
            where: {
                name: { contains: searchString, mode: "insensitive" },
                userId: ctx.user.id,
                ...(!searchString && { folderId: folderId }),
                ...(filter && { type: { startsWith: typeMap[filter] } }),
            },
            orderBy: {[ctx.user.sortPreference]: "asc"}
        });

        const folderMap = new Map(allFolders.map(f => [f.id, f]));

        const convertedFiles = await Promise.all(files.map(async (file) => {
            const filePath = getFileFullPath(folderMap, file, ctx.user.id);
            const fileStat = await stat(filePath).catch(() => null);
            return {
                ...file,
                size: Number(file.size),
                isCorrupted: fileStat === null || fileStat.size !== Number(file.size)
            };
        }));

        return convertedFiles;
    } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    }),
    fetchFolders: protectedProcedure
    .input(z.object({folderId: folderIdType, searchString: z.string()}))
    .query(async ({input, ctx}) => {
        const {folderId, searchString} = input;
        try {
            return prisma.folder.findMany({
                where: {
                    name: {contains: searchString, mode: "insensitive"},
                    userId: ctx.user.id,
                    folderId: folderId
                },
                orderBy: {[ctx.user.sortPreference === "uploadedAt" ? "createdAt" : "name"]: "asc"}
            });
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error fetching folders"});
        }
    }),
    checkDuplicates: protectedProcedure
    .input(z.object({fileNames: z.array(z.string()), folderId: folderIdType}))
    .mutation(async ({input, ctx}) => {
        const {fileNames, folderId} = input;

        const duplicateNames: string[] = [];
        try {
            const files = await prisma.file.findMany({
                where: {name: {in: fileNames}, userId: ctx.user.id, folderId: folderId}
            });

            files.forEach(file => {
                duplicateNames.push(file.name);
            });

            const folderDuplicates = await prisma.folder.findMany({
                where: {name: {in: fileNames}, userId: ctx.user.id, folderId: folderId}
            });

            folderDuplicates.forEach(folder => {
                duplicateNames.push(folder.name);
            });
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR"});
        }

        if (duplicateNames.length > 0) {
                throw new TRPCError({code: "CONFLICT", message: `Files/folders with names: ${(duplicateNames.join(", "))} already exist`})
        }
    }),
    createFileRecord: protectedProcedure
    .input(z.object({fileName: safeName, fileType: z.string(), fileSize: z.number(), folderId: folderIdType}))
    .mutation(async ({input, ctx}) => {
        const {fileName, fileSize, fileType, folderId} = input;
        const sanitizedFileName = path.basename(fileName);

        try {
            const diskStats = await statfs(process.env.FILE_STORAGE_PATH!);

            if ((Number(fileSize) > (diskStats.bavail * diskStats.bsize)) || (Number(ctx.user.maxStorage) !== -1 && (Number(fileSize) + Number(ctx.user.takenSpace) > Number(ctx.user.maxStorage)))) {
                throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: `Upload of file: ${sanitizedFileName} failed`});
            }

            const file = await prisma.$transaction(async (tx) => {
                const file = await tx.file.create({
                    data: {
                        name: sanitizedFileName,
                        userId: ctx.user.id,
                        type: fileType,
                        size: fileSize,
                        folderId: folderId ? Number(folderId) : null
                    },
                });

                await tx.user.update({
                    where: {id: ctx.user.id},
                    data: {takenSpace: {increment: file.size}}
                });

                return file;
            });

            return {id: file.id};
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message:  `Upload of file: ${sanitizedFileName} failed`});
        }
    }),
    createFolder: protectedProcedure
    .input(z.object({name: safeName, folderId: folderIdType, folderStackIDs: folderStackIDsType}))
    .mutation(async ({input, ctx}) => {
        const {name, folderId, folderStackIDs} = input;

        const filePath = await getFilePath(
                  folderStackIDs,
                  path.basename(name),
                  ctx.user.id,
            );
        if(!filePath) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error creating folder"});

        try {
            await mkdir(filePath);
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error creating folder"});
        }

        try {
            await prisma.folder.create({
                data: {
                    name: name,
                    userId: ctx.user.id,
                    folderId: folderId
                }
            });
        } catch (err) {
            await rm(filePath);
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error creating folder"});
        }
    }),
    delete: protectedFileProcedure
    .mutation(async ({ctx}) => {
        try {
            if (existsSync(ctx.filePath)) {
                await unlink(ctx.filePath);
            }
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error removing file"});
        }

        try {
            await prisma.$transaction(async (tx) => {
                await tx.file.delete({
                    where: {id: ctx.file.id, userId: ctx.user.id}
                });

                await tx.user.update({
                    where: {id: ctx.user.id},
                    data: {
                        takenSpace: {decrement: ctx.file.size}
                    }
                });

            });

        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error removing file"});
        }
    }),
    deleteFolder: protectedFolderProcedure
    .mutation(async ({ctx}) => {
        try {
            await rm(ctx.filePath, { recursive: true, force: true })
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error removing folder"});
        }

        const getSubfolders = async (folderId: number, folders: DBFolder[], userId: string) => {
            const subfolders = await prisma.folder.findMany({
                where: {folderId: folderId, userId: userId}
            });

            folders.push(...subfolders);
            await Promise.all(subfolders.map(folder => getSubfolders(folder.id, folders, userId)));
        }

        try {
            const folders: DBFolder[] = [ctx.folder];
            await getSubfolders(ctx.folder.id, folders, ctx.user.id);


            const files = await prisma.file.findMany({
                where: {folderId: {in: folders.map((folder: DBFolder) => folder.id)}, userId: ctx.user.id}
            });

            const totalSize = files.reduce((acc, file: DBFile) => acc + Number(file.size), 0);

            await prisma.$transaction(async (tx) => {
                await tx.folder.delete({
                    where: {id: ctx.folder.id, userId: ctx.user.id}
                });

                await tx.file.deleteMany({
                    where: {id: {in: files.map((file: DBFile) => file.id)}, userId: ctx.user.id}
                });
                
                await tx.user.update({
                    where: {id: ctx.user.id},
                    data: {takenSpace: {decrement: totalSize}}
                });

            });

        } catch (err) {
           throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error removing folder"}); 
        }
    }),
    deleteSelected: protectedProcedure
    .input(z.object({ids: z.array(z.number())}))
    .mutation(async ({input, ctx}) => {
        const {ids} = input;

        if (ids.length === 0) throw new TRPCError({code: "BAD_REQUEST", message: "No files provided"});

        let successfulIds: number[] = [];
        let deletedSize = 0;

        try {
            const allFolders = await prisma.folder.findMany({ where: { userId: ctx.user.id } }),

            files = await prisma.file.findMany({
                where: {id: {in: ids}, userId: ctx.user.id}
            });

            const folderMap = new Map(allFolders.map(f => [f.id, f]));
            
            const results = await Promise.allSettled(
                files.map((file: DBFile) => {
                    const filePath = getFileFullPath(folderMap, file, ctx.user.id);
                    if (existsSync(filePath))
                        return unlink(filePath).then(() => file.id)
                    else
                        return file.id
                })
            );

            successfulIds = results
                .filter(r => r.status === "fulfilled")
                .map(r => r.value);

            deletedSize = files
                .filter(f => successfulIds.includes(f.id))
                .reduce((acc, file) => acc + Number(file.size), 0);

        } catch (err) {
           throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error deleting files"});
        }

        try {
            await prisma.$transaction(async (tx) => {
            await tx.file.deleteMany({
                    where: {id: {in: successfulIds}, userId: ctx.user.id}
                });

                await tx.user.update({
                    where: {id: ctx.user.id},
                    data: {
                        takenSpace: {decrement: deletedSize}
                    }
                });
            });

        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error deleting files"});
        }
    }),
    handleFailedUpload: protectedFileProcedure
    .mutation(async ({ctx}) => {
        try {
            if (existsSync(ctx.filePath)) {
                await unlink(ctx.filePath);
            }
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error handling failed upload"});
        }

        try {
            await prisma.$transaction(async (tx) => {
                const file = await tx.file.delete({
                    where: {id: ctx.file.id, userId: ctx.user.id}
                });

                await tx.user.update({
                    where: {id: ctx.user.id},
                    data: {takenSpace: {decrement: file.size}}
                });
            });;
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error handling failed upload"});
        }
    }),
    rename: protectedFileProcedure
    .input(z.object({oldName: z.string(), newName: z.string()}))
    .mutation(async ({input, ctx}) => {
        const {oldName, newName, folderStackIDs} = input;

        if (invalidChars.test(newName)) throw new TRPCError({code: "BAD_REQUEST", message: "Filename contains forbidden characters"});

        const [existingFile, existingFolder] = await Promise.all([
            prisma.file.findFirst({
                where: { name: newName, userId: ctx.user.id, folderId: ctx.file.folderId }
            }),
            prisma.folder.findFirst({
                where: { name: newName, userId: ctx.user.id, folderId: ctx.file.folderId }
            })
        ]).catch(() => {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error renaming folder" });
        });

        if (existingFile || existingFolder) {
            throw new TRPCError({code: "BAD_REQUEST", message: `Cannot rename "${oldName}": a file named "${newName}" already exists`});
        }

        try {
            await prisma.file.update({
                where: {id: ctx.file.id, userId: ctx.user.id},
                data: {name: newName}
            });

            const newFilePath = await getFilePath(folderStackIDs, newName, ctx.user.id);
            if (!newFilePath) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error renaming file"});
            await rename(ctx.filePath, newFilePath);
        } catch(err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error renaming file"});
        }
    }),
    renameFolder: protectedFolderProcedure
    .input(z.object({oldName: z.string(), newName: z.string()}))
    .mutation(async ({input, ctx}) => {
        const {oldName, newName, folderStackIDs} = input;

        const [existingFile, existingFolder] = await Promise.all([
            prisma.file.findFirst({
                where: { name: newName, userId: ctx.user.id, folderId: ctx.folder.folderId }
            }),
            prisma.folder.findFirst({
                where: { name: newName, userId: ctx.user.id, folderId: ctx.folder.folderId }
            })
        ]).catch(() => {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error renaming folder" });
        });

        if (existingFile || existingFolder) throw new TRPCError({code: "BAD_REQUEST", message: `Cannot rename "${oldName}": a folder/file named "${newName}" already exists`});
        
        try {
            await prisma.folder.update({
                where: {id: ctx.folder.id, userId: ctx.user.id},
                data: {name: newName}
            });

            const newFilePath = await getFilePath(folderStackIDs, newName, ctx.user.id);
            if (!newFilePath) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error renaming folder"});
            await rename(ctx.filePath, newFilePath);
        } catch (err) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error renaming folder" });
        }
    }),
});
