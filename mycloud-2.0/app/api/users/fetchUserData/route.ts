import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error fetching email"},
            {status: 401}
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json(
                {errMessage: "Error fetching email"},
                {status: 404}
            );
        }

        const count = await prisma.file.count({
            where: {userId: user.id}
        });

        return NextResponse.json({email: user.email, fileCount: count});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error fetching email"},
            {status: 500}
        );
    }
}