"use client";

import { useState } from "react";
import { useQueryClient } from "react-query";
import { useFiles, useFolders } from ".";


export const FileNameInput = () => {
    const [name, setName] = useState("");
    const {activeFile, setNameInputVisible} = useFiles();
    const {id, name: oldName, variant} = activeFile;
    const queryClient = useQueryClient();
    const {getOpenedFolderID} = useFolders();

    const handleFile = async (e: React.SubmitEvent) => {
        e.preventDefault();

        await fetch ("/api/files/rename", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                oldName: oldName,
                newName: name
            }),
        });

        setNameInputVisible(false);
        queryClient.invalidateQueries("files");
    }

    const handleFolder = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (id === -1) {
            await fetch("/api/files/create-folder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    folderId: getOpenedFolderID()
                }),
            });
        } else {
            await fetch("/api/files/rename-folder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    newName: name
                }),
            });
        }
        setNameInputVisible(false);
        queryClient.invalidateQueries("folders");
    };

    return (
        <div className="flex items-center justify-center absolute w-screen h-screen left-0 top-0">
            <div className="flex flex-col w-[30%] outline-2 outline-black relative">
                <form className="w-full" onSubmit={variant === "file" ? handleFile : handleFolder}>
                    <h2 className="text-center font-bold">Enter {variant} name:</h2>
                    <input type="text" name="name" className="block p-1 outline-1 outline-black mx-auto" onChange={(e) => setName(e.target.value)}/>
                    <div className="flex w-full">
                        <button className="mr-auto p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" type="button" onClick={() => setNameInputVisible(false)}>Back</button>
                        <button className="ml-auto p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
