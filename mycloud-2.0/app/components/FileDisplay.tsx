"use client";

import { FileBox } from "./FileBox";
import { FileDropDown, FolderTrace, useFiles, useFolders } from ".";
import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";
import { DisplayFile } from "../types";

interface FileDisplayProps {
    className?: string
}


export const FileDisplay = (props: FileDisplayProps) => {
    const {getOpenedFolderID} = useFolders();
    const {setDropDownVisible, searchString, filter} = useFiles();
    const {className} = props;
    const [filesOpen, setFilesOpen] = useState(true);
    const [foldersOpen, setFoldersOpen] = useState(true)

    const trpc = useTRPC();
    const currentId = getOpenedFolderID();

    const { data: files, isLoading: isLoadingFiles, error: errorFiles } = useQuery(
        trpc.files.fetchFiles.queryOptions({ 
            folderId: currentId, 
            searchString, 
            filter 
        })
    );

    const {data: folders, isLoading: isLoadingFolders, error: errorFolders} = useQuery(
        trpc.files.fetchFolders.queryOptions({
            folderId: currentId,
            searchString: searchString
        })
    );

    const renderSpinner = (text: string) => {
        return (
            <div className="flex flex-col w-full items-center justify-center py-14 gap-4">
                <svg
                    className="animate-spin w-8 h-8 text-stone-400"
                    style={{ animationDuration: "0.6s" }}
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" className="text-stone-200"/>
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400">{text}</p>
            </div>
        )
    }

    const style = "flex flex-col w-full h-full bg-stone-50 overflow-y-scroll " + className

    return (
        <div className={style}>
            <FolderTrace />
            {!isLoadingFolders && !errorFolders && (!folders || folders.length == 0) ? <></> :
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
                    {folders && foldersOpen && <div className="flex flex-wrap gap-3 mt-3 ml-3">
                        {isLoadingFolders ? renderSpinner("Loading folders") : errorFolders ?<p>Error loading folders</p> :

                        folders.map((folder) => (
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
            {!isLoadingFiles && !errorFiles && (!files || files.length == 0) ? <div className="flex justify-center w-full items-center mt-50"><div className="relative w-6 h-6 md:w-10 md:h-10"><Image src="./file-x.svg" alt="no-file-icon" fill/></div><p className="text-sm md:text-xl font-bold">{searchString ? "No files found" : "No files provided"}</p></div> :
                <>
                {isLoadingFiles ? renderSpinner("Loading files") : (errorFiles || !files) ?<p>Error loading files</p> :

                (files as DisplayFile[]).map((file: DisplayFile) => (
                    <FileBox key={file.id} id={file.id} name={file.name} isCorrupted={file.isCorrupted} variant="file" mimeType={file.type} />
                ))}
                </>
            }
            </div>}
            <FileDropDown setDropDownVisible={setDropDownVisible}/>
        </div>
    )
};
