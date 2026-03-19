import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: "No session set"
        },
        {status: 401})
    }


    const {id, newName} = await req.json();

    const folder = await prisma.folder.findUnique({
        where: {id: id}
    });

    if (session.user.id !== folder?.userId) {
        return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 401 }
        );
    }

    await prisma.folder.update({
        where: {id: id},
        data: {name: newName}
    });

    return NextResponse.json({message: "Folder name changed"});
}
