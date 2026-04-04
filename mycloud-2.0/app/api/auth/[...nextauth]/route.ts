import prisma from "@/app/lib/prisma";
import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import { JWT } from "next-auth/jwt";

export const authOptions = {
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
                throw new Error("Wrong login credentials");
            }

            if (!user.emailVerified) {
                throw new Error("Account is not verified")
            }

            const passwordMatch = await argon2.verify(user.password, password);

            if (!passwordMatch) {
                throw new Error("Wrong login credentials");
            }

            return {
                id: String(user.id),
                email: email
            };
        },
        }),
    ],

    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User }): Promise<JWT> {
            if (user) {
                token.id = parseInt(user.id);
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (session.user) {
                session.user.id = token.id as number;
            }
            return session;
        },
    },
    session: { strategy: "jwt"  as const},
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/",
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
