import { appendFile, statfs } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { FILE_CHUNK_SIZE } from "@/app/constants";

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);
    const formData = await req.formData();
    const chunk = formData.get("chunk") as Blob;
    const fileName = formData.get("fileName") as string;

    if (!session) {
        return NextResponse.json(
        { errMessage: `Upload of file: ${fileName} failed`},
        { status: 401 }
        );
    }

    if (!chunk || chunk.size > FILE_CHUNK_SIZE) {
        return NextResponse.json(
        { errMessage: `Upload of file: ${fileName} failed`},
        { status: 400 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { errMessage: `Upload of file: ${fileName} failed`},
        { status: 500 }
        );
    }


    try {
        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        const diskStats = await statfs(process.env.FILE_STORAGE_PATH);

        if (!user || (diskStats.bavail * diskStats.bsize < chunk.size)) {
            return NextResponse.json(
            { errMessage: `Upload of file: ${fileName} failed`},
            { status: 500 }
            );
        }


        const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString(), path.basename(fileName));
        const buffer = Buffer.from(await chunk.arrayBuffer());

        await appendFile(filePath, buffer);
    } catch (err) {
        return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`}, { status: 500 });
    }

    return NextResponse.json({ message: "Chunk uploaded successfully" });
}
