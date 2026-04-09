import { NextResponse } from "next/server";
import path from "path";
import { rm } from "fs/promises";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

export const DELETE = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json(
            {errMessage: "Error deleting account"},
            {status: 401}
        );
    }

    try {
        const userFolderPath = path.join(process.env.FILE_STORAGE_PATH!, session.user.id);
        await rm(userFolderPath, { recursive: true, force: true })

        return NextResponse.json({message: "User account deleted"});
    } catch (err) {
        return NextResponse.json(
            {errMessage: "Error deleting account"},
            {status: 500}
        );
    }
}
