"use client";

import { FileBox } from "./FileBox";
import { DisplayFile } from "../types";
import { FileDropDown, FolderTrace, useFiles, useFolders } from ".";
import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface FileDisplayProps {
    className?: string
}

interface DBFolder {
    id: number,
    name: string,
    userId: number
}

export const FileDisplay = (props: FileDisplayProps) => {
    const {getOpenedFolderID} = useFolders();
    const {setDropDownVisible, searchString, filter} = useFiles();
    const {className} = props;
    const [filesOpen, setFilesOpen] = useState(true);
    const [foldersOpen, setFoldersOpen] = useState(true)

    const fetchFiles = async (folderId: number | null) => {
        const res = await fetch(`/api/files/fetchFiles?folderId=${folderId}&search=${searchString}&filter=${filter}`);
        if (!res.ok) throw new Error("Failed to fetch files");
        return res.json();
    }

    const fetchFolders = async (folderId: number | null) => {
        const res = await fetch(`/api/files/fetchFolders?folderId=${folderId}&search=${searchString}`);
        if (!res.ok) throw new Error("Failed to fetch folders");
        return res.json();
    }

    const currentId = getOpenedFolderID();

    const { data: files, status: statusFiles } = useQuery({queryKey: ["files"], queryFn: () => fetchFiles(currentId)});
    const { data: folders, status: statusFolders } = useQuery({queryKey: ["folders"], queryFn: () => fetchFolders(currentId)});

    const style = "flex flex-col w-full h-full bg-stone-50 overflow-y-scroll " + className

    return (
        <div className={style}>
            <FolderTrace />
            {statusFolders !== "pending" && statusFolders !== "error" && folders.length == 0 ? <></> :
                <>
                    <button 
                        onClick={() => setFoldersOpen(!foldersOpen)}
                        className="cursor-pointer group font-black text-2xl md:text-4xl mt-4 w-fit hover:bg-stone-200 py-1 px-5 rounded-full flex items-center gap-2 transition-colors duration-150">
                        Folders
                        <svg 
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            className={`transition-all duration-300 opacity-0 group-hover:opacity-100 ${foldersOpen ? 'rotate-0' : '-rotate-90'}`}>
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    {foldersOpen && <div className="flex flex-wrap gap-3 mt-3 ml-3">
                        {statusFolders === "pending" ? <p>Loading folders...</p> : statusFolders === "error" ?<p>Error loading folders</p> :

                        folders.map((folder: DBFolder) => (
                            <FileBox key = {folder.id} id={folder.id} name={folder.name} isCorrupted={false} variant="folder"/>
                        ))}
                    </div>}
                </>
            }

            <button 
                onClick={() => setFilesOpen(!filesOpen)}
                className="cursor-pointer group font-black text-2xl md:text-4xl mt-4 w-fit hover:bg-stone-200 py-1 px-5 rounded-full flex items-center gap-2 transition-colors duration-150">
                Files
                <svg 
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    className={`transition-all duration-300 opacity-0 group-hover:opacity-100 ${filesOpen ? 'rotate-0' : '-rotate-90'}`}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>
            {filesOpen && <div className="flex flex-row flex-wrap gap-3 mt-3 mb-[5%] ml-3">
            {statusFiles !== "pending" && statusFiles !== "error" && files.length == 0 ? <div className="flex justify-center w-full items-center mt-50"><div className="relative w-6 h-6 md:w-10 md:h-10"><Image src="./file-x.svg" alt="no-file-icon" fill/></div><p className="text-sm md:text-xl font-bold">{searchString ? "No files found" : "No files provided"}</p></div> :
                <>
                {statusFiles === "pending" ? <p>Loading files...</p> : statusFiles === "error" ?<p>Error loading files</p> :

                files.map((file: DisplayFile) => (
                    <FileBox key={file.id} id={file.id} name={file.name} isCorrupted={file.isCorrupted} variant="file" mimeType={file.type} />
                ))}
                </>
            }
            </div>}
            <FileDropDown setDropDownVisible={setDropDownVisible}/>
        </div>
    )
};
