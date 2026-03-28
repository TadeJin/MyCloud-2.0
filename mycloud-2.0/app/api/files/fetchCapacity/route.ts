import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { statfs } from "fs/promises";

export const GET = async () => {
    const session = await getServerSession(authOptions);

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
            return NextResponse.json({ errMessage: "Error fetching capacity" }, {status: 500});
        }

        let maxStorage = Number(user.maxStorage);
        if (maxStorage === -1) {
            if (!process.env.FILE_STORAGE_PATH) {
                return NextResponse.json({ errMessage: "Error fetching capacity" }, {status: 500});
            }
            const diskStats = await statfs(process.env.FILE_STORAGE_PATH);
            maxStorage = diskStats.bavail * diskStats.bsize; 
        }

        return NextResponse.json({taken: Number(user.takenSpace), maxCapacity: maxStorage});
    } catch (err) {
        return NextResponse.json({ errMessage: "Error fetching capacity" }, {status: 500});
    }
}
