import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { statfs } from "fs/promises";

export const GET = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {errMessage: "Failed to fetch free space"},
            {status: 500}
        );
    }


    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json(
            {errMessage: "Failed to fetch free space"},
            {status: 404}
        );
        }

        const diskStats = await statfs(process.env.FILE_STORAGE_PATH!);

        return NextResponse.json({availableUserSpace: Number(user.maxStorage) === -1 ? -1 : Number(user.maxStorage - user.takenSpace), availableDiskSpace: (diskStats.bavail * diskStats.bsize)});
    } catch (err) {
       return NextResponse.json(
            {errMessage: "Failed to fetch free space"},
            {status: 500}
        );
    }
}
