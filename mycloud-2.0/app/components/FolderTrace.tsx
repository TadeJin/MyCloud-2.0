"use client";

import { useFolders } from "./FolderProvider"

export const FolderTrace = () => {
    const {folderStackIDs, folderStackNames, removeFoldersUntil} = useFolders();
    
    return (
        <div className="flex flex-row">
            <div className={`flex flex-row cursor-pointer font-bold hover:text-blue-700 ${folderStackIDs.length === 0 ? "text-blue-700" : ""}`} onClick={() => removeFoldersUntil(-1)}><div>Main</div></div>
            {folderStackIDs.map((folderId, index) => (
                <div className="flex flex-row" key={folderId} onClick={() => removeFoldersUntil(folderId)}><div className="font-bold">{">"}</div><div className={`font-bold hover:text-blue-700 cursor-pointer ${index === folderStackIDs.length - 1 ? "text-blue-700" : ""}`}>{folderStackNames[index]}</div></div>
            ))}
        </div>
    )
}
