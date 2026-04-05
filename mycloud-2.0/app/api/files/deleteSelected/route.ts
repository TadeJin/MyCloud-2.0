import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import path from "path";
import { unlink } from "fs/promises";

export const POST = async (req: NextRequest) => {
    const {ids} = await req.json();
    const session = await getServerSession(authOptions);

    if (!ids || ids.length === 0) {
        return NextResponse.json(
            {errMessage: "Error deleting files"},
            {status: 400}
        );
    }

    if (!process.env.FILE_STORAGE_PATH || !session) {
        return NextResponse.json(
            {errMessage: "Error deleting files"},
            {status: 500}
        );
    }

    try {
        const basePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString());
        const files = await prisma.file.findMany({
            where: {id: {in: ids}, userId: session.user.id}
        });

        const totalFileSize = files.reduce((acc, file) => acc + Number(file.size), 0);

        await prisma.$transaction(async (tx) => {
            await tx.file.deleteMany({
                where: {id: {in: ids}, userId: session.user.id}
            });

            await tx.user.update({
                where: {id: session.user.id},
                data: {
                    takenSpace: {decrement: totalFileSize}
                }
            });
        });

        await Promise.all(files.map(file => unlink(path.join(basePath, path.basename(file.name)))));

        return NextResponse.json({message: "Files deleted"});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error deleting files"},
            {status: 500}
        );
    }
}
