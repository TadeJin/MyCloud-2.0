"use client";

import Image from "next/image";
import { useQueryClient } from "react-query";
import { useFiles, useFolders } from ".";
import { FileVariants } from "../types";

interface FileBoxProps {
    variant: FileVariants,
    id: number,
    name: string,
    mimeType?: string,
    userId: number
}

export const FileBox = ({variant, id, name, mimeType, userId}: FileBoxProps) => {
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
        setActiveFile({id: id, name: name, variant: variant, mimeType: mimeType ? mimeType : "", userId: userId})
        setDropDownPosition({top: rect.bottom, left: rect.left})
        setDropDownVisible(true);
    }

    return (
        <>
            <div className="flex space-x-1 outline-2 outline-black items-center w-40 bg-gray-300 rounded-sm h-10 relative">
                <Image src={isFile ? "/file.svg" : "/folder.svg"} alt="fileIcon" width={20}  height={20}/>
                <div onClick={!isFile ? openFolder : () => {}} className={`${isFile ? "cursor-default" : "cursor-pointer"} truncate w-[70%]`}>{name}</div>
                <div className="flex items-center justify-center mr-1 w-6 h-6 hover:bg-gray-500 rounded-full cursor-pointer" onClick={(e) => openDropDown(e)}><Image src="/dots-vertical.svg" alt="file-dropdown" width={16} height={16}/></div>
            </div>
        </>
    )
}
