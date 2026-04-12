import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import archiver from "archiver";
import prisma from "@/app/lib/prisma";
import { Readable } from "stream";
import { getFileFullPath } from "@/app/lib/fileHelpers";
import { DBFile } from "@/app/types";

export const POST = async (req: NextRequest) => {
    const {ids} = await req.json();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!ids || ids.length === 0) {
        return NextResponse.json(
            {errMessage: "Error downloading files"},
            {status: 400}
        );
    }

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error downloading files"},
            {status: 401}
        );
    }

    try {
         const [user, allFolders] = await Promise.all([
            prisma.user.findUnique({ where: { id: session.user.id } }),
            prisma.folder.findMany({ where: { userId: session.user.id } }),
        ]);

        if (!user) return NextResponse.json({ errMessage: "Error fetching files" }, {status: 404});

        const files = await prisma.file.findMany({
            where: {id: {in: ids}, userId: session.user.id}
        });

        const folderMap = new Map(allFolders.map(f => [f.id, f]));

        const archive = archiver("zip");
        archive.on("error", (err) => {});
    
        files.forEach((file: DBFile) => {
            archive.file(getFileFullPath(folderMap, file, session.user.id), { name: file.name });
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
