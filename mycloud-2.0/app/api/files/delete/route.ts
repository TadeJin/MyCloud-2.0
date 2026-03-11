import prisma from "@/app/lib/prisma";;
import { unlink } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    const {id} = await req.json();

    const file = await prisma.file.delete({
        where: {id: id}
    });

    await prisma.user.update({
        where: {id: session.user.id},
        data: {
            takenSpace: {decrement: file.size}
        }
    });

    const filePath = path.join(process.cwd(), "public", "test_storage", session.user.id.toString(), file.name);
    await unlink(filePath);

    return NextResponse.json({ message: "File removed" });
}
