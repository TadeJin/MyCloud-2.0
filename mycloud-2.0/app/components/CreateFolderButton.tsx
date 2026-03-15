"use client";

import { useFiles } from ".";
import Image from "next/image";

export const CreateFolderButton = () => {
    const {setNameInputVisible, setActiveFile} = useFiles();

    const handleClick = () => {
        setActiveFile({id: -1, mimeType: "", name: "", userId: -1, variant: "folder"});
        setNameInputVisible(true);
    }

    return (
        <div className="flex flex-col w-[80%]">
            <button className = "p-2 rounded-full hover:bg-blue-200 cursor-pointer flex items-center" onClick={handleClick}><Image src="/folder-plus.svg" alt="uploadIcon" width={24} height={24}/><p>Create folder</p></button>
        </div>
    )
};
