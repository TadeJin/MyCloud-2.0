import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error fetching email"},
            {status: 401}
        );
    }

    try {
        const user = await prisma.user.findFirst({
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