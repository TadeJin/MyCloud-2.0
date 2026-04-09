"use client";

import { useQueryClient } from "react-query";
import { useDialog, useErrors, useFiles, useFolders } from ".";
import Image from "next/image";

export const CreateFolderButton = () => {
    const queryClient = useQueryClient();
    const {setActiveFile} = useFiles();
    const {setDialogVisible, setDialogProps} = useDialog();
    const {getOpenedFolderID, folderStackIDs} = useFolders();
    const {setErrorMessage} = useErrors();

    const createFolder = async (newName: string) => {
        setDialogVisible(false);
        const duplicatesRes = await fetch("/api/files/checkDuplicates", {
            method: "POST",
            body: JSON.stringify({
                fileNames: [newName],
                folderId: getOpenedFolderID()
            })
        });

        if (!duplicatesRes.ok) {
            setErrorMessage((await duplicatesRes.json()).errMessage);
            return;
        }

        const res = await fetch("/api/files/createFolder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newName,
                folderId: getOpenedFolderID(),
                folderStackIDs: folderStackIDs
            }),
        });

        if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        queryClient.invalidateQueries("folders");
    }

    const handleClick = () => {
        setActiveFile({id: -1, mimeType: "", name: "", variant: "folder", isCorrupted: false});
        setDialogProps({headerText: "Enter new folder name:", hasInput: true, onSubmit: createFolder})
        setDialogVisible(true);
    }

    return (
         <div className="flex flex-col w-[80%]">
            <button className = "flex items-center gap-0.5 h-10 p-1 bg-stone-50 border border-stone-200 rounded-md hover:bg-stone-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 md:gap-2" onClick={handleClick}>
                <Image src="/folder-plus.svg" alt="uploadIcon" width={24} height={24}/>
                <p className="text-xs md:hidden">Create</p>
                <p className="hidden md:block">Create Folder</p>
            </button>
        </div>
    )
};
