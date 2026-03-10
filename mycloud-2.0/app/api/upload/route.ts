import prisma from "@/app/lib/prisma";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 400 }
        );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
        );
    }

    await prisma.file.create({
        data: {
            name: file.name,
            userId: session.user.id,
        },
    });

    const filePath = path.join(process.cwd(), "public", "test_storage", file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    return NextResponse.json({ 
        message: "File uploaded successfully",
    });
}
