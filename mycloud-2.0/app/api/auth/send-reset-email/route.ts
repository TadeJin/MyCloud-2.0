import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from 'crypto';
import prisma from "@/app/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: NextRequest) => {
    const { email } = await req.json();

     const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) return NextResponse.json({message: "Email sent"});

    const rawToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `${process.env.SITE_DOMAIN}/reset-password?token=${rawToken}`;

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    try {
        await prisma.resetTokens.deleteMany({
            where: { userId: user.id }
        });

        await prisma.resetTokens.create({
            data: {
                token: hashedToken,
                expires: new Date(Date.now() + 1000 * 60 * 60),
                userId: user.id
            }
        })

        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'MyCloud 2.0 Password Reset',
        html: `<p>The link for changing your password is here <a href="${resetLink}">${resetLink}</a> <br>
                If you didn't request a password change ignore this email. <br>
                The reset link will expire in an hour.
                </p>`
        });
    } catch {
        return NextResponse.json({message: "Email sent"})
    }

    return NextResponse.json({message: "Email sent"});
}
