import { mkdir, rm, statfs } from "fs/promises";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import path from "path";
import { existsSync } from "fs";
import prisma from "../../prisma";
import z from "zod";
import { UserSortPreference } from "@/generated/prisma/enums";


export const userRouter = createTRPCRouter({
    fetchCapacity: protectedProcedure
    .query(async ({ctx}) => {
        try {
            let maxStorage = Number(ctx.user.maxStorage);
            if (maxStorage === -1) {
                const diskStats = await statfs(process.env.FILE_STORAGE_PATH!);
                maxStorage = diskStats.bavail * diskStats.bsize; 
            }

            return {taken: Number(ctx.user.takenSpace), maxCapacity: maxStorage};
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error fetching capacity"});
        }
    }),
    createRootFolder: protectedProcedure
    .mutation(async ({ctx}) => {
        try {
            const dirPath = path.join(process.env.FILE_STORAGE_PATH!, ctx.user.id);
            if (existsSync(dirPath)) return;
            await mkdir(dirPath);
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error creating root directory"});
        }
    }),
    deleteUserData: protectedProcedure
    .mutation(async ({ctx}) => {
        try {
            const userFolderPath = path.join(process.env.FILE_STORAGE_PATH!, ctx.user.id);
            await rm(userFolderPath, { recursive: true, force: true })
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error deleting account"});
        }
    }),
    fetchSortPreference: protectedProcedure
    .query(async ({ctx}) => {
        return {sortPreference: ctx.user.sortPreference};
    }),
    fetchUserData: protectedProcedure
    .query(async ({ctx}) => {
        try {
            const count = await prisma.file.count({
                where: {userId: ctx.user.id}
            });

            return {email: ctx.user.email, fileCount: count};
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error fetcing user data"});
        }
    }),
    setSortPreference: protectedProcedure
    .input(z.object({preference: z.enum(UserSortPreference)}))
    .mutation(async ({input, ctx}) => {
        const {preference} = input;
        try {
            await prisma.user.update({
                where: {id: ctx.user.id},
                data: {sortPreference: preference}
            });
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error setting preference"});
        }
    })
});
