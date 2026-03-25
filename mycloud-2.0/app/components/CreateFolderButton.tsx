"use client";

import { useQueryClient } from "react-query";
import { useDialog, useErrors, useFiles, useFolders } from ".";
import Image from "next/image";

export const CreateFolderButton = () => {
    const queryClient = useQueryClient();
    const {setActiveFile} = useFiles();
    const {setDialogVisible, setDialogProps} = useDialog();
    const {getOpenedFolderID} = useFolders();
    const {setErrorMessage} = useErrors();

    const createFolder = async (newName: string) => {
        setDialogVisible(false);
        const res = await fetch("/api/files/createFolder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newName,
                folderId: getOpenedFolderID()
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
        setActiveFile({id: -1, mimeType: "", name: "", variant: "folder"});
        setDialogProps({headerText: "Enter new folder name:", hasInput: true, onSubmit: createFolder})
        setDialogVisible(true);
    }

    return (
        <div className="flex flex-col w-[80%]">
            <button className = "bg-stone-50 rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.10)] hover:shadow-md transition-all p-2 h-10 hover:bg-blue-200 cursor-pointer flex items-center" onClick={handleClick}><Image src="/folder-plus.svg" alt="uploadIcon" width={24} height={24}/><p>Create folder</p></button>
        </div>
    )
};
