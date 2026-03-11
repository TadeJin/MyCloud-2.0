import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import { mkdir } from "fs/promises";
import path from "path";

export const POST = async (req: Request) => {
    const {email, password} = await req.json();

    if (!email || !password) {
        return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
        );
    }

    const user = await prisma.user.create({
        data: {
            email: email,
            password: await argon2.hash(password),
        },
    });

    const dirPath = path.join(process.cwd(), "public", "test_storage", user.id.toString());
    await mkdir(dirPath);

    return NextResponse.json({ message: "User created" }, { status: 201 });
}
