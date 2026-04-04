"use client";

import Image from "next/image";
import { useQueryClient } from "react-query";
import { useFiles, useFolders } from ".";
import { FileVariants } from "../types";
import { ChangeEvent } from "react";

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

    const openFolder = () => {
        addFolder(id, name);
        queryClient.invalidateQueries("folders");
        queryClient.invalidateQueries("files");
    }

    const openDropDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setActiveFile({id: id, name: name, variant: variant, mimeType: mimeType ? mimeType : "", isCorrupted: isCorrupted});
        setDropDownPosition({top: rect.bottom, left: rect.left});
        setDropDownVisible(true);
    }

    const openPreview = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPreviewable) return;
        e.stopPropagation();
        setActiveFile({id: id, name: name, variant: variant, mimeType: mimeType ? mimeType : "", isCorrupted: isCorrupted});
        setPreviewVisible(true);
    }

    const getIcon = () => {
        if (isCorrupted) return "./alert-triangle.svg";
        if(!isFile) return "./folder.svg";
        if (!mimeType) return "./file.svg";
        if (mimeType?.startsWith("image/")) return "./image.svg";
        if (mimeType?.startsWith("video/")) return "./video.svg";
        if (mimeType === "application/x-zip-compressed") return "./archive.svg";
        return "./file.svg";
    }

    const selectOperation = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (e.target.checked) {
            addSelectedFileId(id);
        } else {
            removeSelectedFileId(id);
        }
    }

    return (
        <div className={`flex items-center gap-2 w-44 ${isCorrupted ? "bg-red-100 outline outline-red-400" : "bg-gray-100"} rounded-lg px-2 py-2 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-150 group relative`}>
            {isCorrupted && 
            <div className="absolute w-full flex flex-col items-center -top-7 cursor-default opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    FILE CORRUPTED
                </span>
                 <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500" />
            </div>
            }
            <div className="flex items-center justify-center w-7 h-7">
                {selectActive && isFile && !isCorrupted ? <input type="checkbox" checked={selectedFilesIds.includes(id)} onChange={(e) => selectOperation(e)}></input>: <Image src={getIcon()} alt="fileIcon" width={16} height={16}/>}
            </div>
            <div onClick={!isFile ? openFolder : (e) => openPreview(e)} title={isPreviewable ? "Preview available" : name} className={`${isPreviewable || !isFile ? "cursor-pointer" : "cursor-default"} truncate text-sm font-medium flex-1`}>
                {name}
            </div>
            <div className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer ${!isCorrupted ? "hover:bg-gray-200" : "hover:bg-red-200"} shrink-0`} onClick={(e) => openDropDown(e)}>
                <Image src="/dots-vertical.svg" alt="file-dropdown" width={14} height={14}/>
            </div>
        </div>
    )
}
