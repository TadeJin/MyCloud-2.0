import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { mkdir } from "fs/promises";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const POST = async (req: NextRequest) => {
    const session = await auth.api.getSession({
           headers: await headers()
    });

    if (!session)  {
            return NextResponse.json({errMessage: "Error creating root"}, {status: 400});
        }

    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json({errMessage: "No user found"}, {status: 400});
        }

        const dirPath = path.join(process.env.FILE_STORAGE_PATH!, user.id.toString());
        await mkdir(dirPath);
        return NextResponse.json({message: "Folder created"}, {status: 201});
    } catch (err) {
        return NextResponse.json({errMessage: "Error creating root"}, {status: 500});
    }
}
