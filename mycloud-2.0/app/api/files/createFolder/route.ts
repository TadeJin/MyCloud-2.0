import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export const POST = async (req: NextRequest) => {
    const {name, folderId} = await req.json();


    if (!name) {
        return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
        );
    }

    const session = await getServerSession(authOptions);

     if (!session) {
        return NextResponse.json(
        { error: "Session not set" },
        { status: 401 }
        );
    }

    await prisma.folder.create({
        data: {
            name: name,
            createdAt: new Date(),
            userId: session.user.id,
            folderId: folderId
        }
    });

    return NextResponse.json({message: "Folder created"});
}
