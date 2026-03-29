import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export const PATCH = async (req: NextRequest) => {
    const {newEmail} = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error setting new email"},
            {status: 401}
        );
    }

    if (!newEmail) {
        return NextResponse.json(
            {errMessage: "Error setting new email"},
            {status: 400}
        );
    }

    try {
        await prisma.user.update({
            where: {id: session.user.id},
            data: {email: newEmail}
        });

        return NextResponse.json({message: "Email updated"});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error setting new email"},
            {status: 500}
        );
    }
}
