import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const  POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { errMessage: "Failed to upload file" },
            {status: 401}
        );
    }

    const {fileNames, folderId} = await req.json();

    if (!fileNames) {
        return NextResponse.json(
            { errMessage: "Failed to upload file" },
            {status: 400}
        );
    }

    try {
        const duplicateNames: string[] = [];
        
        const files = await prisma.file.findMany({
            where: {name: {in: fileNames}, userId: session.user.id, folderId: folderId}
        });

        files.forEach(file => {
            duplicateNames.push(file.name);
        });

        const folderDuplicates = await prisma.folder.findMany({
            where: {name: {in: fileNames}, userId: session.user.id, folderId: folderId}
        });

        folderDuplicates.forEach(folder => {
            duplicateNames.push(folder.name);
        });

        if (duplicateNames.length === 0) {
            return NextResponse.json(
                { message: "No duplicate" }
            );
        }

        return NextResponse.json(
            { errMessage: `Files/folders with names: ${(duplicateNames.join(", "))} already exist` },
            {status: 400}
        );

    } catch (err) {
        return NextResponse.json(
            { errMessage: "Failed to upload file" },
            {status: 500}
        );
    }
}
