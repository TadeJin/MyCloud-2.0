import prisma from "@/app/lib/prisma";
import { appendFile } from "fs/promises";
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
    const chunk = formData.get("chunk") as Blob;
    const fileName = formData.get("fileName") as string;

    if (!chunk) {
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
    

    await prisma.user.update({
        where: {id: session.user.id},
        data: {
            takenSpace: {increment: chunk.size}
        }
    });

    const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString(), fileName);
    const buffer = Buffer.from(await chunk.arrayBuffer());

    await appendFile(filePath, buffer);

    return NextResponse.json({ message: "Chunk uploaded successfully" });
}
