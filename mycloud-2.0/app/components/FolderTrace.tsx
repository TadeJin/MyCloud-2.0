"use client";

import { useFolders } from "./FolderProvider"

export const FolderTrace = () => {
    const {folderStackIDs, folderStackNames, removeFoldersUntil} = useFolders();
    
    return (
        <div className="flex flex-row gap-1 bg-gray-100 rounded-full px-4 py-1 w-fit">
            <div className={`flex flex-row cursor-pointer font-bold hover:text-gray-600 ${folderStackIDs.length === 0 ? "text-blue-700" : ""}`} onClick={() => removeFoldersUntil(-1)}>Main</div>
            {folderStackIDs.map((folderId, index) => (
                <div className="flex flex-row gap-1" key={folderId} onClick={() => removeFoldersUntil(folderId)}><div className="font-bold text-gray-400">{"/"}</div><div className={`font-bold hover:text-gray-700 cursor-pointer ${index === folderStackIDs.length - 1 ? "text-blue-700" : ""}`}>{folderStackNames[index]}</div></div>
            ))}
        </div>
    )
}
