import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "../auth";
import { getFilePath } from "../fileHelpers";
import z, { ZodError } from "zod";
import prisma from "../prisma";
import { DBFile, DBFolder } from "@/app/types";
import superjson from "superjson";
import { folderStackIDsType } from "../validators";

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    authUser: session?.user ?? null,
    user: null as Awaited<ReturnType<typeof prisma.user.findUnique>>,
  };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      const message =
        error.cause instanceof ZodError
          ? error.cause.issues[0]?.message ?? "Invalid input"
          : shape.message;
      return { ...shape, message };
    },
  });

// Base router and procedure helpers
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.authUser) throw new TRPCError({ code: "UNAUTHORIZED" });

  const user = await prisma.user.findUnique({
    where: { id: ctx.authUser.id },
  });

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      ...ctx,
      authUser: ctx.authUser,
      user: user,
    },
  });
});

const inputSchema = z.object({
  id: z.number(),
  folderStackIDs: folderStackIDsType,
});

const isVerifiedFile = t.middleware(async ({ctx, next, input}) => {
    if (!ctx.authUser || !ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const result = inputSchema.safeParse(input);
    if (!result.success) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid file data"});

    const { folderStackIDs, id } = result.data;
    
    const file: DBFile | null = await prisma.file.findFirst({ where: { id, userId: ctx.authUser.id } });

    if (!file) throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });

    const filePath = await getFilePath(
      folderStackIDs,
      file.name,
      ctx.authUser.id,
    );

    if (!filePath) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    return next({ ctx: { ...ctx, user: ctx.user, filePath, file } });
});

const isVerifiedFolder = t.middleware(async ({ctx, next, input}) => {
    if (!ctx.authUser || !ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const result = inputSchema.safeParse(input);
    if (!result.success) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid folder data" });

    const { folderStackIDs, id } = result.data;

    const folder: DBFolder | null = await prisma.folder.findFirst({ where: { id, userId: ctx.authUser.id } });

    if (!folder) throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });

    const filePath = await getFilePath(
      folderStackIDs,
      folder.name,
      ctx.authUser.id,
    );

    if (!filePath) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    return next({ ctx: { ...ctx, user: ctx.user, filePath, folder } });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(isAuthed);
export const protectedFileProcedure = protectedProcedure.input(inputSchema).use(isVerifiedFile);
export const protectedFolderProcedure = protectedProcedure.input(inputSchema).use(isVerifiedFolder);
