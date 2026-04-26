"use client";

import { useFolders } from "./FolderProvider"

export const FolderTrace = () => {
    const {folderStackIDs, folderStackNames, removeFoldersUntil} = useFolders();
    
    return (
        <div className="flex flex-row flex-wrap gap-1 bg-stone-100 dark:bg-dark-base border border-stone-200 dark:border-dark-border-subtle rounded-full px-4 py-1 w-fit text-xs md:text-base">
            <div className={`flex flex-row cursor-pointer font-bold hover:text-stone-600 dark:hover:text-dark-text-secondary ${folderStackIDs.length === 0 ? "text-stone-800 dark:text-dark-text-primary" : "text-stone-500 dark:text-dark-text-idle"}`} onClick={() => removeFoldersUntil(-1)}>Main</div>
            {folderStackIDs.map((folderId, index) => (
                <div className="flex flex-row gap-1" key={folderId} onClick={() => removeFoldersUntil(folderId)}><div className="font-bold text-stone-500 dark:text-dark-text-idle">{"/"}</div><div className={`font-bold hover:text-stone-600 dark:hover:text-dark-text-secondary cursor-pointer ${index === folderStackIDs.length - 1 ? "text-stone-800 dark:text-dark-text-primary" : "text-stone-500 dark:text-dark-text-idle"}`}>{folderStackNames[index]}</div></div>
            ))}
        </div>
    );
}
