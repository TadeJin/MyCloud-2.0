"use client";

import { useFolders } from "./FolderProvider"

export const FolderTrace = () => {
    const {folderStackIDs, folderStackNames, removeFoldersUntil} = useFolders();
    
    return (
        <div className="flex flex-row">
            <div className="flex flex-row" onClick={() => removeFoldersUntil(-1)}><div>Main</div></div>
            {folderStackIDs.map((folderId, index) => (
                <div className="flex flex-row" key={folderId} onClick={() => removeFoldersUntil(folderId)}><div>{">"}</div><div>{folderStackNames[index]}</div></div>
            ))}
        </div>
    )
}
