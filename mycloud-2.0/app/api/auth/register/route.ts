import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { mkdir } from "fs/promises";
import path from "path";
import { DEFAULT_MAX_STORAGE } from "@/app/constants";

export const POST = async (req: NextRequest) => {
    const {email, password} = await req.json();

    if (!email || !password) {
        return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { error: "Storage path not set" },
        { status: 400 }
        );
    }

    const duplicate_row = await prisma.user.findFirst({
        where: {email: email}
    });

    if (duplicate_row) {
        return NextResponse.json(
            {errMessage: "Account with this email already exists"},
            {status: 400}
        );
    }

    const user = await prisma.user.create({
        data: {
            email: email,
            password: await argon2.hash(password),
            maxStorage: DEFAULT_MAX_STORAGE
        },
    });

    const dirPath = path.join(process.env.FILE_STORAGE_PATH, user.id.toString());
    await mkdir(dirPath);

    return NextResponse.json({ message: "User created" }, { status: 201 });
}
