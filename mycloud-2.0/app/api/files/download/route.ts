import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import prisma from "@/app/lib/prisma";

export const GET = async (req: NextRequest ) => {
    const session = await getServerSession(authOptions);
    const name = req.nextUrl.searchParams.get("name");
    const type = req.nextUrl.searchParams.get("type");
    const id = Number(req.nextUrl.searchParams.get("id"));
  
    if (!name || !type) {
        return NextResponse.json(
        { errMessage: "Error downloading file" },
        { status: 400 }
        );
    }

    if (!session) {
      return NextResponse.json(
        { errMessage: "Error downloading file" },
        { status: 401 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { errMessage: "Error downloading file" },
        { status: 500 }
        );
    }

    const file = await prisma.file.findFirst({
      where: {id: id, userId: session.user.id}
    });

    if (!file) {
      return NextResponse.json({ errMessage: "File not found" }, {status: 404});
    }

    try {
      const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString(), name);
      const stream = createReadStream(filePath);
      const { size } = statSync(filePath);

      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        headers: {
          'Content-Disposition': `attachment; filename="${name}"`,
          'Content-Type': "application/octet-stream",
          'Content-Length': `${size}`
        }
      });
    } catch (err) {
      return NextResponse.json({ errMessage: "Error downloading file" }, {status: 500});
    }

}
