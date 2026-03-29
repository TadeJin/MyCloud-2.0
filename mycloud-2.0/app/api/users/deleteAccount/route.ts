import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import path from "path";
import { rm } from "fs/promises";

export const DELETE = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error deleting account"},
            {status: 401}
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
            {errMessage: "Error deleting account"},
            {status: 500}
        );
    }

    try {
        await prisma.user.delete({
            where: {id: session.user.id}
        });

        const userFolderPath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString());
        await rm(userFolderPath, { recursive: true, force: true })

        return NextResponse.json({message: "User account deleted"});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error deleting account"},
            {status: 500}
        );
    }
}
