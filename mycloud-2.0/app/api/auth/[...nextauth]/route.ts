import prisma from "@/app/lib/prisma";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },

        async authorize(credentials: Record<string, string> | undefined) {
            if (!credentials) return null;

            const { email, password } = credentials;

            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (!user) {
                return null;
            }

            const passwordMatch = await argon2.verify(user.password, password);

            if (!passwordMatch) return null;

            return {
                id: String(user.id),
                email: email
            };
        },
        }),
    ],

    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/",
    },
});

export { handler as GET, handler as POST };
