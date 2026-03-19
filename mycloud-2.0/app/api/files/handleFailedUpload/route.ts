import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import path from "path";
import { unlink } from "fs/promises";

export const DELETE = async (req: NextRequest) => {
    const { fileId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {error: "Session not set"},
            {status: 401}
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { error: "Storage path not set" },
        { status: 400 }
        );
    }

    const file = await prisma.file.delete({
        where: {id: fileId}
    });

    await prisma.user.update({
        where: {id: session.user.id},
        data: {takenSpace: {decrement: file.size}}
    });

    const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString(), file.name);
    await unlink(filePath);

    return NextResponse.json({message: "Failed upload handled"});

}