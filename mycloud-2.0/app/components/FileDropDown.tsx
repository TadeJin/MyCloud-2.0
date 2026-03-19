"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { useErrors, useFiles } from ".";
import { useQueryClient } from "react-query";

interface FileDropDownProps {
    setDropDownVisible: Dispatch<SetStateAction<boolean>>
}

export const FileDropDown = (props: FileDropDownProps) => {
    const queryClient = useQueryClient();
    const {setErrorMessage} = useErrors();

    const {setDropDownVisible} = props;

    const {activeFile, setNameInputVisible, dropDownPosition, dropDownVisible} = useFiles();
    const {id, name, mimeType, variant} = activeFile;

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
        setDropDownVisible(false);
        const res = await fetch(`/api/files/download?name=${name}&type=${mimeType}&id=${id}`);

        if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        const blob = await res.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();

        URL.revokeObjectURL(url);
    }

    const handleDelete = async () => {
        setDropDownVisible(false);
        const res = await fetch ("/api/files/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
            }),
        });

       if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        queryClient.invalidateQueries("files");
        queryClient.invalidateQueries("capacity");
    }

    const handleDownloadFolder = async () => {
        setDropDownVisible(false);
        const res = await fetch(`/api/files/downloadFolder?folderId=${id}&folderName=${name}`);

        if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const handleDeleteFolder = async () => {
        setDropDownVisible(false);
        const res = await fetch("/api/files/deleteFolder", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                folderId: id,
            })
        });

        if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        queryClient.invalidateQueries("folders");
        queryClient.invalidateQueries("files");
        queryClient.invalidateQueries("capacity");
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
