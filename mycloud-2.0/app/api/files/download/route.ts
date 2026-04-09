import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import prisma from "@/app/lib/prisma";
import { getFilePath } from "@/app/lib/fileHelpers";

export const GET = async (req: NextRequest ) => {
    const session = await auth.api.getSession({ headers: await headers() });
    const id = Number(req.nextUrl.searchParams.get("id"));
    const folderStackIDs = JSON.parse(req.nextUrl.searchParams.get("folderStackIDs") as string);

    if (!session) {
      return NextResponse.json(
        { errMessage: "Error downloading file" },
        { status: 401 }
        );
    }

    const file = await prisma.file.findFirst({
      where: {id: id, userId: session.user.id}
    });

    if (!file) {
      return NextResponse.json({ errMessage: "File not found" }, {status: 404});
    }

    try {
      const filePath = await getFilePath(folderStackIDs, file.name, session.user.id);
      if (!filePath) return NextResponse.json({ errMessage: "Error downloading file" }, {status: 500});
      const stream = createReadStream(filePath);
      const { size } = await stat(filePath);

      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        headers: {
          'Content-Disposition': `attachment; filename="${file.name}"`,
          'Content-Type': file.type,
          'Content-Length': `${size}`
        }
      });
    } catch (err) {
      return NextResponse.json({ errMessage: "Error downloading file" }, {status: 500});
    }
}
