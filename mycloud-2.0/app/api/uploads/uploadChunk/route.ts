import { appendFile, statfs } from "fs/promises";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { FILE_CHUNK_SIZE } from "@/app/constants";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { getFullPath } from "@/app/lib/fileHelpers";

export const POST = async (req: Request) => {
    const session = await auth.api.getSession({
            headers: await headers()
    });

    if (!session) {
        return NextResponse.json(
        { errMessage: `Upload failed`},
        { status: 401 }
        );
    }

    const formData = await req.formData();
    const chunk = formData.get("chunk") as Blob;
    const fileName = formData.get("fileName") as string;
    const fileID = formData.get("fileID") as string;

    if (!fileName || !fileID || !chunk || chunk.size > FILE_CHUNK_SIZE) {
        return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`},{ status: 400 });
    }

    try {
        const file = await prisma.file.findFirst({
            where:{id: Number(fileID), userId: session.user.id}
        });

        if (!file) {
            return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`},{ status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });

        const diskStats = await statfs(process.env.FILE_STORAGE_PATH!);

        if (!user || (diskStats.bavail * diskStats.bsize < chunk.size)) {
            return NextResponse.json(
            { errMessage: `Upload of file: ${fileName} failed`},
            { status: 500 }
            );
        }

        const filePath = await getFullPath(file, session.user.id);

        if (!filePath) {
            return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`},{ status: 500 });
        }

        const buffer = Buffer.from(await chunk.arrayBuffer());

        await appendFile(filePath, buffer);
    } catch (err) {
        return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`}, { status: 500 });
    }

    return NextResponse.json({ message: "Chunk uploaded successfully" });
}
