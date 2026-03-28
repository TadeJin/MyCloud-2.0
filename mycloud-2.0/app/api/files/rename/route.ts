import prisma from "@/app/lib/prisma";
import { rename } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            errMessage: "Error renaming file"
        },
        {status: 401})
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { errMessage: "Error renaming file" },
        { status: 500 }
        );
    }

    const {id, oldName, newName} = await req.json();
    const invalidFileName = /[<>:"/\\|?*\x00-\x1F]/;

    if(invalidFileName.test(newName)) {
        return NextResponse.json(
        { errMessage: "Error renaming file" },
        { status: 500 }
        );
    }

    const duplicate = await prisma.file.findFirst({
        where: {
            name: newName,
            userId: session.user.id
        }
    });

    if (duplicate) {
        return NextResponse.json(
        { errMessage: `Cannot rename "${oldName}": a file named "${newName}" already exists` },
        { status: 400 }
        );
    }

    const file = await prisma.file.findUnique({
        where: {id: id, userId: session.user.id}
    });

    if (!file) {
        return NextResponse.json({ errMessage: "File not found" }, {status: 404});
    }

    try {
        await prisma.file.update({
            where: {id: id},
            data: {name: newName}
        });

        const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString());
        await rename(path.join(filePath, oldName), path.join(filePath, newName));
    } catch(err) {
        return NextResponse.json({ errMessage: "Error renaming file" }, {status: 500});
    }

    return NextResponse.json({message: "File name changed"});
}
