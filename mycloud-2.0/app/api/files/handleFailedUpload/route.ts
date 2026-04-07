import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { unlink } from "fs/promises";
import { getFilePath } from "@/app/lib/fileHelpers";
import { existsSync } from "fs";


export const DELETE = async (req: NextRequest) => {
    const { fileId, folderStackIDs } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {errMessage: "Session not set"},
            {status: 401}
        );
    }

    try {
        const file = await prisma.file.findUnique({
            where: {id: fileId, userId: session.user.id}
        });

        if (!file) return NextResponse.json({errMessage: "Upload cancel failed"}, {status: 404});

        const filePath = await getFilePath(folderStackIDs, file.name, session.user.id);
        if (!filePath) return NextResponse.json({errMessage: "Upload cancel failed"}, {status: 500});

        if (existsSync(filePath)) {
            await unlink(filePath);
        }
    } catch (err) {
        return NextResponse.json({errMessage: "Upload cancel failed"}, {status: 500});
    }
    
    try {
        await prisma.$transaction(async (tx) => {
            const file = await tx.file.delete({
                where: {id: fileId, userId: session.user.id}
            });

            await tx.user.update({
                where: {id: session.user.id},
                data: {takenSpace: {decrement: file.size}}
            });
        });

        return NextResponse.json({message: "Failed upload handled"});
    } catch (err) {
        return NextResponse.json({errMessage: "Upload cancel failed"}, {status: 500});
    }
}
