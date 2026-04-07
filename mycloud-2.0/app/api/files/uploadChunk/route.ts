import { appendFile, statfs } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { FILE_CHUNK_SIZE } from "@/app/constants";
import { DBFolder } from "@/app/types";

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);
    const formData = await req.formData();
    const chunk = formData.get("chunk") as Blob;
    const fileName = formData.get("fileName") as string;
    const folderStackIDs = JSON.parse(formData.get('folderStackIDs') as string);

    if (!session) {
        return NextResponse.json(
        { errMessage: `Upload of file: ${fileName} failed`},
        { status: 401 }
        );
    }

    if (!chunk || chunk.size > FILE_CHUNK_SIZE || !folderStackIDs) {
        return NextResponse.json(
        { errMessage: `Upload of file: ${fileName} failed`},
            { status: 400 }
            );
    }

    try {
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

        const folders = await prisma.folder.findMany({
            where: {id : {in: folderStackIDs}, userId: session.user.id}
        });

        if (folders.length !== folderStackIDs.length) return NextResponse.json({errMessage: "Error creating folder"}, {status: 500});
        const orderedFolders = folderStackIDs.map((id: number) => folders.find(f => f.id === id)!);

        const filePath = path.join(process.env.FILE_STORAGE_PATH!, session.user.id.toString(), orderedFolders.reduce((folderPath: string, folder: DBFolder) => path.join(folderPath, path.basename(folder.name)), ""), path.basename(fileName));
        const buffer = Buffer.from(await chunk.arrayBuffer());

        await appendFile(filePath, buffer);
    } catch (err) {
        return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`}, { status: 500 });
    }

    return NextResponse.json({ message: "Chunk uploaded successfully" });
}
