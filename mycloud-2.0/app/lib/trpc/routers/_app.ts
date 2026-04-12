import { statfs } from 'fs/promises';
import { createTRPCRouter, protectedProcedure } from '../init';
import { fileRouter } from './files';
import { userRouter } from './users';
import { TRPCError } from '@trpc/server';
 
export const appRouter = createTRPCRouter({
    files: fileRouter,
    users: userRouter,
    fetchDiskCapacity: protectedProcedure
    .mutation(async ({ctx}) => {
        try {
            const diskStats = await statfs(process.env.FILE_STORAGE_PATH!);

            return {availableUserSpace: Number(ctx.user.maxStorage) === -1 ? -1 : Number(ctx.user.maxStorage - ctx.user.takenSpace), availableDiskSpace: (diskStats.bavail * diskStats.bsize)};
        } catch (err) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Error fetching disk capacity"});
        }
    }),
});
 
// export type definition of API
export type AppRouter = typeof appRouter;