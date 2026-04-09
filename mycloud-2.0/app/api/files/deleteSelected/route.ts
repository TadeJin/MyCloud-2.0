import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { unlink } from "fs/promises";
import { DBFile } from "@/app/types";
import { getFileFullPath } from "@/app/lib/fileHelpers";
import { existsSync } from "fs";

export const POST = async (req: NextRequest) => {
    const {ids} = await req.json();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!ids || ids.length === 0) {
        return NextResponse.json(
            {errMessage: "Error deleting files"},
            {status: 400}
        );
    }

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error deleting files"},
            {status: 500}
        );
    }

    let files: DBFile[] = [];
    let successfulIds: number[] = [];
    let deletedSize = 0;

    try {
        const [user, allFolders] = await Promise.all([
            prisma.user.findUnique({ where: { id: session.user.id } }),
            prisma.folder.findMany({ where: { userId: session.user.id } }),
        ]);

        if (!user) return NextResponse.json({ errMessage: "Error fetching files" }, {status: 404});

        files = await prisma.file.findMany({
            where: {id: {in: ids}, userId: session.user.id}
        });

        const folderMap = new Map(allFolders.map(f => [f.id, f]));
        
        const results = await Promise.allSettled(
            files.map((file: DBFile) => {
                const filePath = getFileFullPath(folderMap, file, session.user.id);
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
        return NextResponse.json({errMessage: "Error deleting files"},{status: 500});
    }

    try {
        await prisma.$transaction(async (tx) => {
           await tx.file.deleteMany({
                where: {id: {in: successfulIds}, userId: session.user.id}
            });

            await tx.user.update({
                where: {id: session.user.id},
                data: {
                    takenSpace: {decrement: deletedSize}
                }
            });
        });

        return NextResponse.json({message: "Files deleted"});
    } catch (err) {
        return NextResponse.json({errMessage: "Error deleting files"},{status: 500});
    }
}
