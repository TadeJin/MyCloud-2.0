"use client"

import { useRef, useState } from "react"
import { useQueryClient } from "react-query";

export const UploadButton = () => {
    const [status, setStatus] = useState("");
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);

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
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData();

        formData.append("file", file);
        setStatus("Uploading: " + file.name);

        await fetch("/api/files/upload", {
            method: "POST",
            body: formData
        })

        setStatus("");
    }

    return (
        <div>
            <button onClick={handleClick}>Upload</button>
            <input ref={inputRef} type="file" className="hidden" id="upload" onChange={handleUpload} multiple/>
            <p>{status}</p>
        </div>
    )
}