import prisma from "@/app/lib/prisma";
import { rename } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

export const PATCH = async (req: NextRequest) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({
            errMessage: "Error renaming file"
        },
        {status: 401})
    }

    const {id, oldName, newName} = await req.json();
    const invalidFileName = /[<>:"/\\|?*\x00-\x1F]/;

    if(invalidFileName.test(newName)) {
        return NextResponse.json(
        { errMessage: "Error renaming file" },
        { status: 400 }
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

    const file = await prisma.file.findFirst({
        where: {id: id, userId: session.user.id}
    });

    if (!file) {
        return NextResponse.json({ errMessage: "File not found" }, {status: 404});
    }

    try {
        await prisma.file.update({
            where: {id: id, userId: session.user.id},
            data: {name: newName}
        });

        const filePath = path.join(process.env.FILE_STORAGE_PATH!, session.user.id);
        await rename(path.join(filePath, path.basename(file.name)), path.join(filePath, path.basename(newName)));
    } catch(err) {
        return NextResponse.json({ errMessage: "Error renaming file" }, {status: 500});
    }

    return NextResponse.json({message: "File name changed"});
}
