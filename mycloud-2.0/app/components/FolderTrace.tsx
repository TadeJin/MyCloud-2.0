"use client";

import { useFolders } from "./FolderProvider"

export const FolderTrace = () => {
    const {folderStackIDs, folderStackNames, removeFoldersUntil} = useFolders();
    
    return (
        <div className="flex flex-row flex-wrap gap-1 bg-stone-100 border border-stone-200 rounded-full px-4 py-1 w-fit text-xs md:text-base">
            <div className={`flex flex-row cursor-pointer font-bold text-stone-500 hover:text-stone-600  ${folderStackIDs.length === 0 ? "text-stone-800" : ""}`} onClick={() => removeFoldersUntil(-1)}>Main</div>
            {folderStackIDs.map((folderId, index) => (
                <div className="flex flex-row gap-1" key={folderId} onClick={() => removeFoldersUntil(folderId)}><div className="font-bold text-stone-500">{"/"}</div><div className={`font-bold hover:text-stone-600 cursor-pointer text-stone-500 ${index === folderStackIDs.length - 1 ? "text-stone-800" : ""}`}>{folderStackNames[index]}</div></div>
            ))}
        </div>
    );
}
