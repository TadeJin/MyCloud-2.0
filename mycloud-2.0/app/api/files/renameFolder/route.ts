import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

export const PATCH = async (req: NextRequest) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({
           errMessage: "Error renaming folder"
        },
        {status: 401})
    }


    const {id, newName} = await req.json();

    const invalidFileName = /[<>:"/\\|?*\x00-\x1F]/;

    if (invalidFileName.test(newName)) {
        return NextResponse.json(
        { errMessage: "Error renaming file" },
        { status: 400 }
        );
    }

    const folder = await prisma.folder.findFirst({
        where: {id: id, userId: session.user.id}
    });

    if (!folder) {
        return NextResponse.json({ errMessage: "Folder not found" }, {status: 404});
    }

    try {
        await prisma.folder.update({
            where: {id: id, userId: session.user.id},
            data: {name: newName}
        });
    } catch(err) {
        return NextResponse.json({ errMessage: "Error renaming folder" }, {status: 500});
    }
    return NextResponse.json({message: "Folder name changed"});
}
