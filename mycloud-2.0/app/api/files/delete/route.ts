import prisma from "@/app/lib/prisma";;
import { unlink } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { existsSync } from "fs";
import { getFilePath } from "@/app/lib/fileHelpers";

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const {id, folderStackIDs} = await req.json();

    if (!session) {
        return NextResponse.json(
        { errMessage: "Error removing file"},
        { status: 401 }
        );
    }

    const file = await prisma.file.findFirst({
        where: {id: id, userId: session.user.id}
    })

    if (!file) {
        return NextResponse.json({ errMessage: "File not found"}, {status: 404});
    }

    try {
        const filePath = await getFilePath(folderStackIDs, file.name, session.user.id);
        if (!filePath) return NextResponse.json({ errMessage: "Error removing file"}, {status: 500});

        if (existsSync(filePath)) {
            await unlink(filePath);
        }
    } catch (err) {
        return NextResponse.json({ errMessage: "Error removing file"}, {status: 500});
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.file.delete({
                where: {id: id, userId: session.user.id}
            });

            await tx.user.update({
                where: {id: session.user.id},
                data: {
                    takenSpace: {decrement: file.size}
                }
            });

        });

        return NextResponse.json({ message: "File removed" });
    } catch (err) {
        return NextResponse.json({ errMessage: "Error removing file"}, {status: 500});
    }
}
