import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

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

        return NextResponse.json({taken: user?.takenSpace, maxCapacity: user?.maxStorage});
    } catch (err) {
        return NextResponse.json({ errMessage: "Error fetching capacity" }, {status: 500});
    }
}
