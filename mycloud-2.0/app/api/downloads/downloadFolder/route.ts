import prisma from "@/app/lib/prisma";
import archiver from "archiver";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { getFilePath } from "@/app/lib/fileHelpers";


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const folderId = Number(searchParams.get("folderId"));
    const folderStackIDs = JSON.parse(req.nextUrl.searchParams.get("folderStackIDs") as string);
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json({ 
        errMessage: "Error downloading folder" },
        {status: 401}); 
    }

    const folder = await prisma.folder.findFirst({
        where: {id: folderId, userId: session.user.id}
    });

    if (!folder) {
        return NextResponse.json({ errMessage: "Folder not found" }, { status: 404 });
    }

    try {
        const folderPath = await getFilePath(folderStackIDs, folder.name, session.user.id);
        if (!folderPath) return NextResponse.json({ errMessage: "Error downloading folder" }, {status: 500});
        const archive = archiver("zip");
        archive.on("error", (err) => {});
        archive.directory(folderPath, false);
        archive.finalize();

        const stream = Readable.from(archive);
        return new NextResponse(stream as unknown as BodyInit, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(folder.name)}.zip"`,
            }
        });
    } catch (err) {
        return NextResponse.json({ errMessage: "Error downloading folder" }, {status: 500});
    }
}
