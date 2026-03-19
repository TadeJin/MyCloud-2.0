import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createReadStream, statSync } from "fs";
import { Readable } from "stream";

export const GET = async (req: NextRequest ) => {
    const session = await getServerSession(authOptions);
    const name = req.nextUrl.searchParams.get('name');
    const type = req.nextUrl.searchParams.get('type');
    const userId = req.nextUrl.searchParams.get('userId');
  
    if (!name || !type) {
        return NextResponse.json(
        { error: "Error downloading" },
        { status: 400 }
        );
    }

    if (!session) {
      return NextResponse.json(
        { error: "No session set" },
        { status: 401 }
        );
    }

    if (session.user.id !== Number(userId)) {
        return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 401 }
        );
    }

    if (!process.env.FILE_STORAGE_PATH) {
        return NextResponse.json(
        { error: "Storage path not set" },
        { status: 400 }
        );
    }

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
}
