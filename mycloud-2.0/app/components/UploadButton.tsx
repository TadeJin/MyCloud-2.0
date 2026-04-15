"use client"

import { useRef, useState } from "react"
import { ProgressBar, useErrors, useFolders, useSpinners } from ".";
import Image from "next/image";
import { FILE_CHUNK_SIZE } from "../constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";
import { TRPCClientError } from "@trpc/client";

export const UploadButton = () => {
    const [status, setStatus] = useState("");
    const cancelledRef = useRef(false);
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const {getOpenedFolderID} = useFolders();
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const {setErrorMessage} = useErrors();
    const {showSpinner, hideSpinner} = useSpinners();
    
    const trpc = useTRPC();
    const fetchDiskCapacityMutation = useMutation(trpc.fetchDiskCapacity.mutationOptions());
    const duplicateCheckMutation = useMutation(trpc.files.checkDuplicates.mutationOptions());
    const handleFailedUploadMutation = useMutation(trpc.files.handleFailedUpload.mutationOptions());
    const createFileRecordMutation = useMutation(trpc.files.createFileRecord.mutationOptions());

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

        let availableDiskSpace;
        let availableUserSpace;
        try {
           const {availableDiskSpace: a, availableUserSpace: b} =  await fetchDiskCapacityMutation.mutateAsync();
           availableDiskSpace = a;
           availableUserSpace = b;
        } catch (err) {
            if (err instanceof TRPCClientError) {
                setFailedUploadErr(err.message, e.target);
                return;
            }
        }

        if (!availableDiskSpace || !availableUserSpace) {
            setFailedUploadErr("Error fetching capacity", e.target);
            return;
        }

        try {
            await duplicateCheckMutation.mutateAsync({fileNames: files.map(file => file.name), folderId: getOpenedFolderID()})
        } catch (err) {
            if (err instanceof TRPCClientError) {
                setFailedUploadErr(err.message, e.target);
                return;
            }
        }
     
        let totalSize = 0;
        files.forEach(async (file) => {
            totalSize += file.size;
        });

        if ((availableUserSpace !== -1 && totalSize > availableUserSpace) || totalSize > availableDiskSpace) {
            setFailedUploadErr("Not enough space", e.target);
            return;
        }

        const folderId = getOpenedFolderID();

        for (const file of files) {
            setStatus("Uploading: " + file.name);
            setUploadPercentage(0);
            const fileRecord = await createFileRecord(file.name, file.type, file.size, folderId);
            
            if(!fileRecord) {
                setFailedUploadErr(`Error uploading file: ${file.name}`, e.target);
                return;
            }

            const fileID = fileRecord.id.toString();

            const chunkPercentage = (FILE_CHUNK_SIZE * 100) / file.size;

            for (let start = 0; start < file.size; start += FILE_CHUNK_SIZE) {
                if (cancelledRef.current) {
                    cancelledRef.current = false;
                    await handleFailedUploadMutation.mutateAsync({id: fileRecord.id});
                    hideSpinner();
                    break;
                }

                const res = await uploadChunk(file.slice(start, start + FILE_CHUNK_SIZE), file.name, fileID);

                if (!res.ok) {
                    await handleFailedUploadMutation.mutateAsync({id: fileRecord.id});
                    setFailedUploadErr(`Upload of file: ${file.name} failed`, e.target);
                    return;
                }

                setUploadPercentage(prev => prev + chunkPercentage);
            }

            queryClient.invalidateQueries(trpc.users.fetchCapacity.queryFilter());
            queryClient.invalidateQueries(trpc.files.fetchFiles.queryFilter());
            setStatus("");
            if (cancelledRef) break;
        }
        e.target.value = "";
    }

    const uploadChunk = async (chunk: Blob, fileName: string, fileID: string) => {
        const formData = new FormData();

        formData.append("fileName", fileName);
        formData.append("fileID", fileID);
        formData.append("chunk", chunk);
        

        const res = await fetch("/api/uploads/uploadChunk", {
            method: "POST",
            body: formData
        });

        return res;
    }

    const createFileRecord = async (fileName: string, fileType: string, fileSize: number, folderId: number | null) => {
        try {
            return createFileRecordMutation.mutateAsync({fileName: fileName, fileSize: fileSize, fileType: fileType, folderId: folderId});
        } catch (err) {
            return null;
        }
    }

    return (
        <div className="flex flex-col w-[80%] relative">
            <button className="flex items-center gap-1 p-2 bg-stone-50 border border-stone-200 rounded-md hover:bg-stone-100 hover:border-stone-300 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200" onClick={handleClick}>
                <Image src="/file-plus.svg" alt="uploadIcon" width={24} height={24}/>
                <p className="text-xs md:hidden">Upload</p>
                <p className="hidden md:block">Upload Files</p>
            </button>
            <input ref={inputRef} type="file" className="hidden" id="upload" onChange={handleUpload} multiple/>
            <div className={`overflow-hidden transition-all duration-500 ease-out w-full relative ${status ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="absolute top-4 right-1 hover:bg-stone-200 rounded-full cursor-pointer" onClick={() => {showSpinner("Cancelling upload"); cancelledRef.current = true}}><Image src="./x.svg" width={16} height={16} alt=""/></div>
                <div className="flex flex-col w-full gap-1 bg-white mt-3 p-3.5 rounded-md border border-stone-200">
                    <p className="text-center font-bold text-xs truncate">{status}</p>
                    <ProgressBar percentage={uploadPercentage} color="bg-blue-500"/>
                </div>
            </div>
        </div>
    );
}
