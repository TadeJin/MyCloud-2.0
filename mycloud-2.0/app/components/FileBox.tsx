"use client";

import Image from "next/image";
import { useQueryClient } from "react-query";
import { useState } from "react";
import { FileNameInput } from "./FileNameInput";
import { useFolders } from "./FolderProvider";

interface FileBoxProps {
    variant: "file" | "folder",
    id: number,
    name: string,
    mimeType?: string,
    userId: number
}

export const FileBox = ({variant, id, name, mimeType, userId}: FileBoxProps) => {
    const queryClient = useQueryClient();
    const [isVisible, setVisible] = useState(false);
    const isFile = variant === "file";
    const {addFolder} = useFolders();

    const handleDownload = async () => {
        const res = await fetch(`/api/files/download?name=${name}&type=${mimeType}&userId=${userId}`);
        const blob = await res.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();

        URL.revokeObjectURL(url);
    }

    const handleDelete = async () => {
        await fetch ("/api/files/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                userId: userId
            }),
        });

        queryClient.invalidateQueries("files");
    }

    const openFolder = () => {
        addFolder(id, name);
        queryClient.invalidateQueries("folders");
        queryClient.invalidateQueries("files");
    }

    const handleDownloadFolder = async () => {
        const res = await fetch(`/api/files/download-folder?folderId=${id}&folderName=${name}&userId=${userId}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const handleDeleteFolder = async () => {
        await fetch("/api/files/delete-folder", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                folderId: id,
                userId: userId
            })
        });

        queryClient.invalidateQueries("folders");
        queryClient.invalidateQueries("files");
    }

    return (
        <div className="flex space-x-1 outline-2 outline-black items-center w-fit">
            <Image src={isFile ? "/file.svg" : "/folder.svg"} alt="fileIcon" width={20}  height={20}/>
            <div onClick={!isFile ? openFolder : () => {}}>{name}</div>
            <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={isFile ? handleDownload : handleDownloadFolder}>Download</button>
            <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={isFile ? handleDelete : handleDeleteFolder}>Delete</button>
            <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={() => setVisible(true)}>Rename</button>
            {isVisible && <FileNameInput variant={variant} id={id} oldName={name} setVisible={setVisible}/>}
        </div>
    )
}
