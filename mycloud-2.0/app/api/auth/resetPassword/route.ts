import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import argon2 from "argon2";

export const PATCH = async (req: NextRequest) => {
    const {password, token} = await req.json();

    if (!password || !token) {
         return NextResponse.json(
        { error: "Missing input data" },
        { status: 400 }
        );
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const dbToken = await prisma.resetTokens.findUnique({
        where: {
            token: hashedToken,
        },
    });

    if (!dbToken || dbToken.expires < new Date()) {
        return NextResponse.json(
            { error: "Invalid token" },
            { status: 401 }
        )
    }

    await prisma.$transaction([
        prisma.user.update({
            where: {id: dbToken.userId},
            data: {password: await argon2.hash(password)}
        }),

        prisma.resetTokens.delete({
            where: { id: dbToken.id }
        }),
    ]);

    return NextResponse.json({message: "Password changed"})
}
