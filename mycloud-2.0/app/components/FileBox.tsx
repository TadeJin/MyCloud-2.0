"use client";

import Image from "next/image";
import { useQueryClient } from "react-query";
import { useFiles, useFolders } from ".";
import { FileVariants } from "../types";

interface FileBoxProps {
    variant: FileVariants,
    id: number,
    name: string,
    mimeType?: string
}

export const FileBox = ({variant, id, name, mimeType}: FileBoxProps) => {
    const isFile = variant === "file";
    const {addFolder} = useFolders();
    const queryClient = useQueryClient();
    const {setActiveFile, setDropDownVisible, setDropDownPosition} = useFiles();

    const openFolder = () => {
        addFolder(id, name);
        queryClient.invalidateQueries("folders");
        queryClient.invalidateQueries("files");
    }

    const openDropDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setActiveFile({id: id, name: name, variant: variant, mimeType: mimeType ? mimeType : ""})
        setDropDownPosition({top: rect.bottom, left: rect.left})
        setDropDownVisible(true);
    }

    return (
        <>
           <div className="flex items-center gap-2 w-44 bg-gray-100 rounded-lg px-2 py-2 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-150 group relative">
                <div className="flex items-center justify-center w-7 h-7">
                    <Image src={isFile ? "/file.svg" : "/folder.svg"} alt="fileIcon" width={16} height={16}/>
                </div>
                <div onClick={!isFile ? openFolder : () => {}} className={`${isFile ? "cursor-default" : "cursor-pointer"} truncate text-sm font-medium flex-1`}>
                    {name}
                </div>
                <div className="flex items-center justify-center w-6 h-6 rounded-full cursor-pointer hover:bg-gray-200 shrink-0" onClick={(e) => openDropDown(e)}>
                    <Image src="/dots-vertical.svg" alt="file-dropdown" width={14} height={14}/>
                </div>
            </div>
        </>
    )
}
