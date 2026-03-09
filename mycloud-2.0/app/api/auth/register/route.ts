import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import argon2 from "argon2";

export const POST = async (req: Request) => {
    const {email, password} = await req.json();

    if (!email || !password) {
        return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
        );
    }

    await prisma.user.create({
        data: {
            email: email,
            password: await argon2.hash(password),
        },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
}
