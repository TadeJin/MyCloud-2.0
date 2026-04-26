"use client";

import { AlertTriangleIcon, ArchiveIcon, DotsVerticalIcon, FileIcon, FolderIcon, ImageIcon, VideoIcon } from ".";
import { useFiles, useFolders } from ".";
import { FileVariants } from "../types";
import { ChangeEvent, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";

interface FileBoxProps {
    variant: FileVariants,
    id: number,
    name: string,
    mimeType?: string,
    isCorrupted: boolean
}

export const FileBox = (props: FileBoxProps) => {
    const {variant, id, name, mimeType, isCorrupted} = props;
    const isFile = variant === "file";
    const {addFolder} = useFolders();
    const queryClient = useQueryClient();
    const {setActiveFile, setDropDownVisible, setDropDownPosition, setPreviewVisible, selectActive, addSelectedFileId, removeSelectedFileId, selectedFilesIds} = useFiles();
    const isPreviewable = mimeType && (mimeType.startsWith("image/") || mimeType.startsWith("video/") || mimeType === "application/pdf") && !isCorrupted;
    const checkboxRef = useRef<HTMLInputElement>(null);
    const trpc = useTRPC();

    const openFolder = async () => {
        addFolder(id, name);
        queryClient.invalidateQueries(trpc.files.fetchFolders.queryFilter());
        queryClient.invalidateQueries(trpc.files.fetchFiles.queryFilter());
    }

    const openDropDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        const dropdownWidth = 124;
        const dropdownHeight = 160;

        const left = rect.left + dropdownWidth > window.innerWidth
            ? rect.left - dropdownWidth
            : rect.left;

        const top = rect.bottom + dropdownHeight > window.innerHeight
            ? rect.top - dropdownHeight
            : rect.bottom;
        setActiveFile({id: id, name: name, variant: variant, mimeType: mimeType ? mimeType : "", isCorrupted: isCorrupted});
        setDropDownPosition({top: top, left: left});
        setDropDownVisible(true);
    }

    const openPreview = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPreviewable) return;
        e.stopPropagation();
        setActiveFile({id: id, name: name, variant: variant, mimeType: mimeType ? mimeType : "", isCorrupted: isCorrupted});
        setPreviewVisible(true);
    }

    const getFileIcon = () => {
        if (isCorrupted) return <AlertTriangleIcon className="w-3 h-3 md:w-4 md:h-4 dark:text-dark-text-primary" />;
        if (!isFile) return <FolderIcon className="w-3 h-3 md:w-4 md:h-4 dark:text-dark-text-primary" />;
        if (!mimeType) return <FileIcon className="w-3 h-3 md:w-4 md:h-4 dark:text-dark-text-primary" />;
        if (mimeType?.startsWith("image/")) return <ImageIcon className="w-3 h-3 md:w-4 md:h-4 dark:text-dark-text-primary" />;
        if (mimeType?.startsWith("video/")) return <VideoIcon className="w-3 h-3 md:w-4 md:h-4 dark:text-dark-text-primary" />;
        if (mimeType === "application/x-zip-compressed") return <ArchiveIcon className="w-3 h-3 md:w-4 md:h-4 dark:text-dark-text-primary" />;
        return <FileIcon className="w-3 h-3 md:w-4 md:h-4 dark:text-dark-text-primary" />;
    }

    const selectOperation = (e: React.MouseEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (!selectedFilesIds.has(id)) {
            addSelectedFileId(id, name);
        } else {
            removeSelectedFileId(id);
        }
    }

    return (
        <div onClick={!isFile ? openFolder : (e) => {if (!selectActive) openPreview(e); else selectOperation(e)}} title={isPreviewable ? "Preview available" : name} className={`flex items-center md:gap-2 w-28 md:w-44 ${isCorrupted ? "bg-red-100 outline outline-red-400 dark:outline-red-400 dark:bg-red-300/30 hover:bg-red-200 dark:hover:bg-red-200/40" : "bg-stone-100 dark:bg-dark-card border border-stone-200 dark:border-dark-border hover:bg-white dark:hover:bg-dark-hover"}
                    rounded-lg px-2 py-2 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-150 group relative
                    ${isPreviewable || !isFile ? "cursor-pointer" : "cursor-default"}`}>
            {isCorrupted && 
            <div className="absolute w-full flex flex-col items-center -top-7 cursor-default opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    FILE CORRUPTED
                </span>
                 <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500" />
            </div>
            }
            <div className="flex items-center justify-center w-7 h-7">
                {selectActive && isFile ? (<input type="checkbox" ref={checkboxRef} checked={selectedFilesIds.has(id)} onChange={(e) => selectOperation(e)}></input>) : getFileIcon()}
            </div>
            <div className="truncate text-sm font-medium flex-1 dark:text-dark-text-primary">
                <p className="text-xs md:text-base">{name}</p>
            </div>
            <div className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer ${!isCorrupted ? "hover:bg-stone-200 dark:hover:bg-[#454545]" : "hover:bg-red-300 dark:hover:bg-red-300/40"} shrink-0`} onClick={(e) => openDropDown(e)}>
                <DotsVerticalIcon size={14} className="dark:text-dark-text-primary"/>
            </div>
        </div>
    );
}
