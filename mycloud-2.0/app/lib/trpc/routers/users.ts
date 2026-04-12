import { mkdir, rm, statfs } from "fs/promises";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import path from "path";
import { existsSync } from "fs";
import prisma from "../../prisma";
import z from "zod";
import { UserSortPreference } from "@/generated/prisma/enums";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

        try {
            await resend.emails.send({
                from: 'noreply@mycld.cz',
                to: ctx.user.email,
                subject: "Welcome to Mycloud-2.0!",
                html: `<h1>Welcome to MyCloud 2.0!</h1>
                <p>Your account has been created successfully.</p>
                <p>You start with <strong>1GB of free storage</strong>. Upload files, organize them into folders, and access them from anywhere.</p>
                    <br/>
                <p>— The MyCloud 2.0 Team</p>`
            });
        } catch(err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error sending welcome email"});
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
