import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import archiver from "archiver";
import path from "path";
import prisma from "@/app/lib/prisma";
import { Readable } from "stream";

export const POST = async (req: NextRequest) => {
    const {ids} = await req.json();
    const session = await getServerSession(authOptions);

    if (!ids || ids.length === 0) {
        return NextResponse.json(
            {errMessage: "Error downloading files"},
            {status: 400}
        );
    }

    if (!process.env.FILE_STORAGE_PATH || !session) {
        return NextResponse.json(
            {errMessage: "Error downloading files"},
            {status: 500}
        );
    }

    try {
        const archive = archiver("zip");
        const basePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString());

        const files = await prisma.file.findMany({ where: { id: {in: ids}, userId: session.user.id } });
    
        files.forEach(file => {
            archive.file(path.join(basePath, file.name), { name: file.name });
        });

        archive.finalize();
        
        const stream = Readable.from(archive);
        return new NextResponse(stream as unknown as BodyInit, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="selected_files.zip"`,
            }
        });
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error downloading files"},
            {status: 500}
        );
    }
}