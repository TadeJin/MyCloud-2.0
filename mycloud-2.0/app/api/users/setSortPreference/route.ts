import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { SortPreference } from "@/app/types";

export const GET = async (req: NextRequest) => {
    const preference = req.nextUrl.searchParams.get("preference") as SortPreference;
    const session = await auth.api.getSession({ headers: await headers() });

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
