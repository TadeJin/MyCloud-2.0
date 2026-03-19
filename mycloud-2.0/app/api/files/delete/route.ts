import prisma from "@/app/lib/prisma";;
import { unlink } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const {id} = await req.json();

    if (!session) {
        return NextResponse.json(
        { message: "Error removing file"},
        { status: 401 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { message: "Error removing file"},
        { status: 500 }
        );
    }

    const file = await prisma.file.findFirst({
        where: {id: id, userId: session.user.id}
    })

    if (!file) {
        return NextResponse.json({ message: "File not found"}, {status: 404});
    }

    try {
        const file = await prisma.$transaction(async (tx) => {
            const file = await tx.file.delete({
                where: {id: id}
            });

            await tx.user.update({
                where: {id: session.user.id},
                data: {
                    takenSpace: {decrement: file.size}
                }
            });

            return file;
        });

        const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString(), file.name);
        await unlink(filePath);

    } catch (err) {
        return NextResponse.json({ message: "Error removing file"}, {status: 500});
    }

    return NextResponse.json({ message: "File removed" });
}
