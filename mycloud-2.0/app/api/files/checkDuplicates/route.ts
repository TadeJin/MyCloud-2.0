import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const  POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { errMessage: "Failed to upload file" },
            {status: 401}
        );
    }

    const fileNames = (await req.json()).fileNames;

    if (!fileNames) {
        return NextResponse.json(
            { errMessage: "Failed to upload file" },
            {status: 400}
        );
    }

    try {
        const files = await prisma.file.findMany({
            where: {name: {in: fileNames}, userId: session.user.id}
        });

        if (files.length === 0) {
            return NextResponse.json(
                { message: "No duplicate" }
            );
        }

        return NextResponse.json(
            { errMessage: `Files with names: ${(files.map(file => file.name).join(", "))} already exist` },
            {status: 400}
        );

    } catch (err) {
        return NextResponse.json(
            { errMessage: "Failed to upload file" },
            {status: 500}
        );
    }
}
