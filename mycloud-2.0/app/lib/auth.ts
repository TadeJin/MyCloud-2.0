import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { DEFAULT_MAX_STORAGE } from "../constants";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = ({to, subject, text}: {to: string, subject: string, text: string}) => {
    resend.emails.send({
        from: 'noreply@mycld.cz',
        to: to,
        subject: subject,
        html: text
    });
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        changeEmail: {
            enabled: true,
        },
        deleteUser: { 
            enabled: true
        },
        additionalFields: {
            maxStorage: {
                type: "number",
                required: false,
                defaultValue: DEFAULT_MAX_STORAGE,
            },
            takenSpace: {
                type: "number",
                required: false,
                defaultValue: 0,
            },
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            void sendEmail({
                to: user.email,
                subject: "MyCloud 2.0 email verification'",
                    text: `<h1>MyCloud 2.0 email verification</h1>
                    <p>Please verify your email here: <a href="${url}">${url}</a>.</p>`,
                });
            },
        sendOnSignIn: true
    },
    emailAndPassword: {    
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async ({user, url, token}, request) => {
            void sendEmail({
                to: user.email,
                subject: "MyCloud 2.0 Password Reset",
                text: `<p>The link for changing your password is here <a href="${url}">${url}</a> <br>
                If you didn't request a password change ignore this email. <br>
                The reset link will expire in an hour.
                </p>`,
            });
        },
    },
});
