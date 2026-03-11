import prisma from "@/app/lib/prisma";
import { rename } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: "No session set"
        },
        {status: 401})
    }

    const {id, oldName, newName} = await req.json();

    await prisma.file.update({
        where: {id: id},
        data: {name: newName}
    });

    const filePath = path.join(process.cwd(), "public", "test_storage", session.user.id.toString());
    await rename(path.join(filePath, oldName), path.join(filePath, newName));

    return NextResponse.json({message: "File name changed"});
}
