"use client";

import { useQuery } from "react-query";
import { FileBox } from "./FileBox";
import { DBFile } from "../types";
import { FileDropDown, FolderTrace, useFiles, useFolders } from ".";
import { useState } from "react";

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
    const {setDropDownVisible} = useFiles();
    const {className} = props;
    const [filesOpen, setFilesOpen] = useState(true);
    const [foldersOpen, setFoldersOpen] = useState(true)

    const fetchFiles = async (folderId: number | null) => {
        const res = await fetch(`/api/files/fetchFiles?folderId=${folderId}`);
        return res.json();
    }

    const fetchFolders = async (folderId: number | null) => {
        const res = await fetch(`/api/files/fetchFolders?folderId=${folderId}`);
        return res.json();
    }

    const currentId = getOpenedFolderID();

    const { data: files, status: statusFiles } = useQuery(["files", currentId], () => fetchFiles(currentId));
    const { data: folders, status: statusFolders } = useQuery(["folders", currentId], () => fetchFolders(currentId));

    const style = "flex flex-col rounded-md w-full h-full rounded-lg bg-stone-50 pr-30 overflow-y-scroll " + className

    return (
        <div className={style}>
            <FolderTrace />
            {statusFolders !== "loading" && statusFolders !== "error" && folders.length == 0 ? <></> :
                <>
                    <button 
                        onClick={() => setFoldersOpen(!foldersOpen)}
                        className="cursor-pointer group font-black text-4xl mt-4 w-fit hover:bg-gray-100 py-1 px-5 rounded-full flex items-center gap-2 transition-colors duration-150">
                        Folders
                        <svg 
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            className={`transition-all duration-300 opacity-0 group-hover:opacity-100 ${foldersOpen ? 'rotate-0' : '-rotate-90'}`}>
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    {foldersOpen && <div className="flex flex-wrap gap-3 mt-3">
                        {statusFolders === "loading" ? <p>Loading folders...</p> : statusFolders === "error" ?<p>Error loading folders</p> :

                        folders.map((folder: DBFolder) => (
                            <FileBox key = {folder.id} id={folder.id} name={folder.name} variant="folder"/>
                        ))}
                    </div>}
                </>
            }

            <button 
                onClick={() => setFilesOpen(!filesOpen)}
                className="cursor-pointer group font-black text-4xl mt-4 w-fit hover:bg-gray-100 py-1 px-5 rounded-full flex items-center gap-2 transition-colors duration-150">
                Files
                <svg 
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    className={`transition-all duration-300 opacity-0 group-hover:opacity-100 ${filesOpen ? 'rotate-0' : '-rotate-90'}`}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>
            {filesOpen && <div className="flex flex-wrap gap-3 mt-3 mb-[5%]">
            {statusFiles !== "loading" && statusFiles !== "error" && files.length == 0 ? <p>No files uploaded</p> :
                <>
                {statusFiles === "loading" ? <p>Loading files...</p> : statusFiles === "error" ?<p>Error loading files</p> :

                files.map((file: DBFile) => (
                    <FileBox key = {file.id} id={file.id} name={file.name} variant="file" mimeType={file.type} />
                ))}
                </>
            }
            </div>}
            <FileDropDown setDropDownVisible={setDropDownVisible}/>
        </div>
    )
};
