import prisma from "@/app/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server";
import { statfs } from "fs/promises";

export const GET = async () => {
    const session = await getServerSession(authOptions);

    if (!session || !process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
            {errMessage: "Failed to upload file"},
            {status: 500}
        );
    }


    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json(
            {errMessage: "Failed to upload file"},
            {status: 401}
        );
        }

        const diskStats = await statfs(process.env.FILE_STORAGE_PATH);

        return NextResponse.json({availableUserSpace: Number(user.maxStorage - user.takenSpace), availableDiskSpace: (diskStats.bavail * diskStats.bsize)});
    } catch (err) {
       return NextResponse.json(
            {errMessage: "Failed to upload file"},
            {status: 500}
        );
    }
}
