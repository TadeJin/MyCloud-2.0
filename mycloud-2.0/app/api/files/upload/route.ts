import prisma from "@/app/lib/prisma";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId");

    if (!file) {
        return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { error: "Storage path not set" },
        { status: 400 }
        );
    }

    await prisma.file.create({
        data: {
            name: file.name,
            userId: session.user.id,
            type: file.type,
            size: file.size,
            uploadedAt: new Date(),
            folderId: folderId ? Number(folderId) : null
        },
    });

    await prisma.user.update({
        where: {id: session.user.id},
        data: {
            takenSpace: {increment: file.size}
        }
    });

    const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString(), file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    return NextResponse.json({ message: "File uploaded successfully" }, {status: 201});
}
