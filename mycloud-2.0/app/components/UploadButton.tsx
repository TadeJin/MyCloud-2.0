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
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const handleClick = () => {
        inputRef.current?.click();
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);

        if (files?.length == 0) return;

        const chunkSize = 20 * 1024 * 1024;
        const folderId = getOpenedFolderID();

        for (const file of files) {
            setStatus("Uploading: " + file.name);
            setUploadPercentage(0);
            createFileRecord(file.name, file.type, file.size, folderId);
            const chunkPercentage = (chunkSize * 100) / file.size;

            for (let start = 0; start < file.size; start += chunkSize) {
                await uploadChunk(file.slice(start, start + chunkSize), file.name, folderId);
                setUploadPercentage(prev => prev + chunkPercentage);
            }

            queryClient.invalidateQueries("capacity");
            await queryClient.invalidateQueries("files");
            setStatus("");
        }
        e.target.value = "";
    }

    const uploadChunk = async (chunk: Blob, fileName: string, folderId: number | null) => {
        const formData = new FormData();

        formData.append("fileName", fileName);
        formData.append("chunk", chunk);
        formData.append("folderId", folderId ? folderId.toString() : "");
        

        await fetch("/api/files/uploadChunk", {
            method: "POST",
            body: formData
        })
    }

    const createFileRecord = async (fileName: string, fileType: string, fileSize: number, folderId: number | null) => {
        await fetch("/api/files/createFileRecord", {
            method: "POST",
            body: JSON.stringify({
                fileName: fileName,
                fileType: fileType,
                fileSize: fileSize,
                folderId: folderId
            })
        });
    }

    return (
        <div className="flex flex-col w-[80%]">
            <button className = "p-2 rounded-full hover:bg-blue-200 cursor-pointer" onClick={handleClick}><div className="flex"><Image src="/file-plus.svg" alt="uploadIcon" width={24} height={24}/><p>Upload Files</p></div></button>
            <input ref={inputRef} type="file" className="hidden" id="upload" onChange={handleUpload} multiple/>
            {status && <div className="flex flex-col w-full">
                <p className="ml-2">{status}</p>
                <ProgressBar percentage={uploadPercentage} />
            </div>}
        </div>
    )
}
