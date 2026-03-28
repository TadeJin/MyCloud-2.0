import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { mkdir } from "fs/promises";
import path from "path";
import { DEFAULT_MAX_STORAGE } from "@/app/constants";
import { Resend } from "resend";
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    try {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const resetLink = `${process.env.SITE_DOMAIN}/verify-email?token=${rawToken}`;
        
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        const user = await prisma.user.create({
            data: {
                email: email,
                password: await argon2.hash(password),
                maxStorage: DEFAULT_MAX_STORAGE,
                verifyToken: hashedToken
            },
        });

        const dirPath = path.join(process.env.FILE_STORAGE_PATH, user.id.toString());
        await mkdir(dirPath);

        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'MyCloud 2.0 email verification',
        html: `<h1>Welcome to MyCloud 2.0!</h1>
                <p>In order to use MyCloud 2.0 please verify your email with the link below.</p>
                <p>Verification link <a href="${resetLink}">${resetLink}</a></p>`
        });
        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error registering"},
            {status: 500}
        );
    }
}
