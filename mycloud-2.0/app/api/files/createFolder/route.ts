import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export const POST = async (req: NextRequest) => {
    const {name, folderId} = await req.json();
    const session = await getServerSession(authOptions);

    if (!name) {
        return NextResponse.json(
        { errMessage: "Error creating folder" },
        { status: 400 }
        );
    }

     if (!session) {
        return NextResponse.json(
        { errMessage: "Error creating folder" },
        { status: 401 }
        );
    }

    try {
        await prisma.folder.create({
            data: {
                name: name,
                createdAt: new Date(),
                userId: session.user.id,
                folderId: folderId
            }
        });
    } catch (err) {
        return NextResponse.json({errMessage: "Error creating folder"}, {status: 500});
    }

    return NextResponse.json({message: "Folder created"});
}
