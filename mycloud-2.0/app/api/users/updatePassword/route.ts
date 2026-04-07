import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import argon2 from "argon2";

export const PATCH = async (req: NextRequest) => {
    const {newPassword} = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error updating password"},
            {status: 401}
        );
    }

    if (!newPassword) {
        return NextResponse.json(
            {errMessage: "Error updating password"},
            {status: 400}
        );
    }

    try {
       await prisma.user.update({
            where: {id: session.user.id},
            data: {password: await argon2.hash(newPassword)}
       });

       return NextResponse.json({message: "Password changed"});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error updating password"},
            {status: 500}
        );
    }
}
