import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
           errMessage: "Error renaming folder"
        },
        {status: 401})
    }


    const {id, newName} = await req.json();

    const folder = await prisma.folder.findUnique({
        where: {id: id, userId: session.user.id}
    });

    if (!folder) {
        return NextResponse.json({ errMessage: "Folder not found" }, {status: 404});
    }

    try {
        await prisma.folder.update({
            where: {id: id},
            data: {name: newName}
        });
    } catch(err) {
        return NextResponse.json({ errMessage: "Error renaming folder" }, {status: 500});
    }
    return NextResponse.json({message: "Folder name changed"});
}
