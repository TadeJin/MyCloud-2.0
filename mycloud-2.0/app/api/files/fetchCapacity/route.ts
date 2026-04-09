import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { statfs } from "fs/promises";

export const GET = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {error: "No session set"},
            {status: 401}
        );
    }

    try {
        const user = await prisma.user.findUnique(
            {where: {
                id: session.user.id
            }}
        );

        if (!user) {
            return NextResponse.json({ errMessage: "Error fetching capacity" }, {status: 404});
        }

        let maxStorage = Number(user.maxStorage);
        if (maxStorage === -1) {
            const diskStats = await statfs(process.env.FILE_STORAGE_PATH!);
            maxStorage = diskStats.bavail * diskStats.bsize; 
        }

        return NextResponse.json({taken: Number(user.takenSpace), maxCapacity: maxStorage});
    } catch (err) {
        return NextResponse.json({ errMessage: "Error fetching capacity" }, {status: 500});
    }
}
