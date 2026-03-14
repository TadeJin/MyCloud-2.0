"use client";

import Image from "next/image";
import { useQueryClient } from "react-query";
import { useState } from "react";
import { FileDropDown, FileNameInput, useFolders } from ".";

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
    const [dropDownVisible, setDropDownVisible] = useState(false);

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
        <>
            <div className="flex space-x-1 outline-2 outline-black items-center w-40 bg-gray-300 rounded-sm h-10 relative">
                <Image src={isFile ? "/file.svg" : "/folder.svg"} alt="fileIcon" width={20}  height={20}/>
                <div onClick={!isFile ? openFolder : () => {}} className={`${isFile ? "cursor-default" : "cursor-pointer"} truncate w-[70%]`}>{name}</div>
                <div className="flex items-center justify-center mr-1 w-6 h-6 hover:bg-gray-500 rounded-full cursor-pointer" onClick={() => setDropDownVisible(!dropDownVisible)}><Image src="/dots-vertical.svg" alt="file-dropdown" width={16} height={16}/></div>
                {dropDownVisible && <FileDropDown handleDownload={isFile ? handleDownload : handleDownloadFolder} handleDelete={isFile ? handleDelete : handleDeleteFolder} setVisible={setVisible} setDropDownVisible={setDropDownVisible} />}
            </div>
            {isVisible && <FileNameInput variant={variant} id={id} oldName={name} setVisible={setVisible} />}
        </>
    )
}
