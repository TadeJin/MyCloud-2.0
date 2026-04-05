import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route";
import { SortPreference } from "@/app/types";

export const GET = async (req: NextRequest) => {
    const preference = req.nextUrl.searchParams.get("preference") as SortPreference;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error setting preference"},
            {status: 401}
        );
    }

    if (!preference) {
        return NextResponse.json(
            {errMessage: "Error setting preference"},
            {status: 400}
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        if (!user) {
            return NextResponse.json(
                {errMessage: "Error setting preference"},
                {status: 404}
            );
        }

        await prisma.user.update({
            where: {id: session.user.id},
            data: {sortPreference: preference}
        });

        return NextResponse.json({message: "Preference set"});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error setting preference"},
            {status: 500}
        );
    }
}
