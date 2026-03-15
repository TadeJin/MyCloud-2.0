"use client"

import { useRef, useState } from "react"
import { useQueryClient } from "react-query";
import { useFolders } from ".";

export const UploadButton = () => {
    const [status, setStatus] = useState("");
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const {getOpenedFolderID} = useFolders();

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
        <div className="flex flex-col gap-5">
            <button className = "p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" onClick={handleClick}>Upload</button>
            <input ref={inputRef} type="file" className="hidden" id="upload" onChange={handleUpload} multiple/>
            <p>{status}</p>
        </div>
    )
}
