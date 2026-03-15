"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { useFiles } from ".";
import { useQueryClient } from "react-query";

interface FileDropDownProps {
    setDropDownVisible: Dispatch<SetStateAction<boolean>>
}

export const FileDropDown = (props: FileDropDownProps) => {
    const queryClient = useQueryClient();

    const {setDropDownVisible} = props;

    const {activeFile, setNameInputVisible, dropDownPosition, dropDownVisible} = useFiles();
    const {id, name, mimeType, userId, variant} = activeFile;

    const isFile = variant === "file";

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dropDownVisible) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropDownVisible(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropDownVisible, setDropDownVisible]);

    const handleDownload = async () => {
        const res = await fetch(`/api/files/download?name=${name}&type=${mimeType}&userId=${userId}`);
        const blob = await res.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();

        URL.revokeObjectURL(url);
        setDropDownVisible(false);
    }

    const handleDelete = async () => {
        await fetch ("/api/files/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                userId: userId
            }),
        });

        queryClient.invalidateQueries("files");
        setDropDownVisible(false);
    }

    const handleDownloadFolder = async () => {
        const res = await fetch(`/api/files/download-folder?folderId=${id}&folderName=${name}&userId=${userId}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.zip`;
        a.click();
        URL.revokeObjectURL(url);
        setDropDownVisible(false);
    }

    const handleDeleteFolder = async () => {
        await fetch("/api/files/delete-folder", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                folderId: id,
                userId: userId
            })
        });

        queryClient.invalidateQueries("folders");
        queryClient.invalidateQueries("files");
        setDropDownVisible(false);
    }

    return (
        <>
        {dropDownVisible && <div ref={dropdownRef} style={{ top: dropDownPosition.top, left: dropDownPosition.left }} className="flex flex-col fixed bg-white outline-2 outline-black rounded-md w-30 z-10">
            <button className="hover:bg-gray-600 cursor-pointer" onClick={isFile ? handleDownload : handleDownloadFolder}>Download</button>
            <button className="hover:bg-gray-600 cursor-pointer" onClick={isFile ? handleDelete : handleDeleteFolder}>Delete</button>
            <button className="hover:bg-gray-600 cursor-pointer" onClick={() => {setDropDownVisible(false); setNameInputVisible(true)}}>Rename</button> 
        </div>}
        </>
    )
};
