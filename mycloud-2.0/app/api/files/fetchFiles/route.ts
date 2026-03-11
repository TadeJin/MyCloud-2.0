import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    const files = await prisma.file.findMany({
        where: {
            userId: session?.user.id,
        },
    });

    return NextResponse.json(files);
}
