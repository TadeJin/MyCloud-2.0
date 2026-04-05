import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const GET = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error fetching preference"},
            {status: 401}
        )
    }

    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json(
                {errMessage: "Error fetching preference"},
                {status: 404}
            );
        }

        return NextResponse.json({sortPreference: user.sortPreference});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error fetching preference"},
            {status: 500}
        );
    }
}
