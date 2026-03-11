import { readFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async (req: NextRequest ) => {
    const session = await getServerSession(authOptions);
    const name = req.nextUrl.searchParams.get('name');
    const type = req.nextUrl.searchParams.get('type');
  
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

    const filePath = path.join(process.cwd(), "public", "test_storage", session.user.id.toString(), name);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
    headers: {
      'Content-Disposition': `attachment; filename="${name}"`,
      'Content-Type': type,
    }
  });
}
