import { appendFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    if (!chunk) {
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
        const filePath = path.join(process.env.FILE_STORAGE_PATH, session.user.id.toString(), fileName);
        const buffer = Buffer.from(await chunk.arrayBuffer());

        await appendFile(filePath, buffer);
    } catch (err) {
        return NextResponse.json({ errMessage: `Upload of file: ${fileName} failed`}, { status: 500 });
    }

    return NextResponse.json({ message: "Chunk uploaded successfully" });
}
