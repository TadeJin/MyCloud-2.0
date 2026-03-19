import prisma from "@/app/lib/prisma";
import path from "path";
import archiver from "archiver";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const folderId = Number(searchParams.get("folderId"));
    const folderName = Number(searchParams.get("folderName"));
    const session = await getServerSession(authOptions);

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json({ 
            errMessage: "Error downloading folder"
        },
        {status: 500});
    }

    if (!session) {
        return NextResponse.json({ 
        errMessage: "Error downloading folder" },
        {status: 401}); 
    }

    const folder = await prisma.folder.findFirst({
        where: {id: folderId, userId: session.user.id}
    });

    if (!folder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    try {
        const archive = archiver("zip");
        const basePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString());
        await downloadFolder(folderId, basePath, archive);
        archive.finalize();

        const stream = Readable.from(archive);
        return new NextResponse(stream as unknown as BodyInit, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${folderName}.zip"`,
            }
        });
    } catch (err) {
        return NextResponse.json({ errMessage: "Error downloading folder" }, {status: 500});
    }
}


const downloadFolder = async (folderId: number, basePath: string, archive: archiver.Archiver) => {
    const files = await prisma.file.findMany({ where: { folderId: folderId } });
    
    files.forEach(file => {
        archive.file(path.join(basePath, file.name), { name: file.name });
    });

    const subFolders = await prisma.folder.findMany({ where: { folderId: folderId } });
    await Promise.all(subFolders.map(folder => downloadFolder(folder.id, basePath, archive)));
}
