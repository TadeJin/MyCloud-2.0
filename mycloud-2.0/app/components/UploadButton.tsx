"use client"

import { useRef, useState } from "react"
import { useQueryClient } from "react-query";
import { ProgressBar, useFolders } from ".";
import Image from "next/image";

export const UploadButton = () => {
    const [status, setStatus] = useState("");
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const {getOpenedFolderID} = useFolders();
    const uploadPercentage = 50;

    const handleClick = () => {
        inputRef.current?.click();
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);;

        if (files?.length == 0) return;

        for (const file of files) {
            await uploadFile(file);
        }
        queryClient.invalidateQueries("files");
        e.target.value = "";
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        const folderId = getOpenedFolderID();

        formData.append("file", file);
        formData.append("folderId", folderId ? folderId.toString() : "");
        setStatus("Uploading: " + file.name);

        await fetch("/api/files/upload", {
            method: "POST",
            body: formData
        })

        setStatus("");
    }

    return (
        <div className="flex flex-col w-[80%]">
            <button className = "p-2 rounded-full hover:bg-blue-200 cursor-pointer" onClick={handleClick}><div className="flex"><Image src="/file-plus.svg" alt="uploadIcon" width={24} height={24}/><p>Upload File</p></div></button>
            <input ref={inputRef} type="file" className="hidden" id="upload" onChange={handleUpload} multiple/>
            {status && <div className="flex flex-col">
                <p className="ml-2">{status}</p>
                <ProgressBar percentage={uploadPercentage} />
            </div>}
        </div>
    )
}
