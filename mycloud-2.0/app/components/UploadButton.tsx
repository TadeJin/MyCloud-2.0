"use client"

import { useRef, useState } from "react"
import { useQueryClient } from "react-query";
import { ProgressBar, useErrors, useFolders } from ".";
import Image from "next/image";

export const UploadButton = () => {
    const [status, setStatus] = useState("");
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const {getOpenedFolderID} = useFolders();
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const {setErrorMessage} = useErrors();

    const handleClick = () => {
        inputRef.current?.click();
    }

    const setFailedUploadErr = (errMessage: string, fileInput: HTMLInputElement) => {
        setErrorMessage(errMessage);
        setStatus("");
        fileInput.value = "";
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);

        if (files?.length == 0) return;

        const spaceRes = await fetch("/api/files/fetchFreeSpace");

        if (!spaceRes.ok) {
            setFailedUploadErr((await spaceRes.json()).errMessage, e.target);
            return;
        }

        const duplicateCheck = await fetch("/api/files/checkDuplicates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fileNames: files.map(file => file.name)
            })
        });

        if (!duplicateCheck.ok) {
            setFailedUploadErr((await duplicateCheck.json()).errMessage, e.target);
            return;
        }

        const availableSpaceInfo = await spaceRes.json();
    
        let totalSize = 0;
        files.forEach(async (file) => {
            totalSize += file.size;
        });

        if (totalSize > availableSpaceInfo.availableUserSpace || totalSize > availableSpaceInfo.availableDiskSpace) {
            setFailedUploadErr("Not enough space", e.target);
            return;
        }

        const chunkSize = 20 * 1024 * 1024;
        const folderId = getOpenedFolderID();

        for (const file of files) {
            setStatus("Uploading: " + file.name);
            setUploadPercentage(0);
            const fileRecordRes = await createFileRecord(file.name, file.type, file.size, folderId);
            
            if(!fileRecordRes.ok) {
                const fileRecord = await fileRecordRes.json();
                setFailedUploadErr(fileRecord.errMessage, e.target);
                return;
            }

            const fileRecord = await fileRecordRes.json();
            const chunkPercentage = (chunkSize * 100) / file.size;

            for (let start = 0; start < file.size; start += chunkSize) {
                const res = await uploadChunk(file.slice(start, start + chunkSize), file.name, folderId);
                if (!res.ok) {
                    await fetch ("/api/files/handleFailedUpload", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fileId: fileRecord.id
                        }),
                    });
                    setFailedUploadErr(`Upload of file: ${file.name} failed`, e.target);
                    return;
                }

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
        

        const res = await fetch("/api/files/uploadChunk", {
            method: "POST",
            body: formData
        });

        return res;
    }

    const createFileRecord = async (fileName: string, fileType: string, fileSize: number, folderId: number | null) => {
        const res = await fetch("/api/files/createFileRecord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fileName: fileName,
                fileType: fileType,
                fileSize: fileSize,
                folderId: folderId
            })
        });

        return res;
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
