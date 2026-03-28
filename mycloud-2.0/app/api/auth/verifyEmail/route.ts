import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/app/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const GET = async (req: NextRequest) => {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
        return NextResponse.json(
            {errMessage: "Error verifying email"},
            {status: 400}
        );
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');


    try {
        const user = await prisma.user.findFirst({
            where: {verifyToken: hashedToken, emailVerified: false}
        });

        if (!user) {
            return NextResponse.json(
                {errMessage: "Error verifying email"},
                {status: 400}
            );
        }

        await prisma.user.update({
            where: {id: user.id},
            data: {emailVerified: true}
        });

        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Welcome to MyCloud 2.0',
        html: `<h1>Welcome to MyCloud 2.0!</h1>
                <p>Your account has been created successfully.</p>
                <p>You start with <strong>1GB of free storage</strong>. Upload files, organize them into folders, and access them from anywhere.</p>
                    <br/>
                <p>— The MyCloud 2.0 Team</p>`
        });

        return NextResponse.json({message: "Email verified"});
    } catch(err) {
        return NextResponse.json(
            {errMessage: "Error verifying email"},
            {status: 500}
        );
    }
}
