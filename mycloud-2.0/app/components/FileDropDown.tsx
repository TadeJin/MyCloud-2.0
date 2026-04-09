"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { useDialog, useErrors, useFiles, useFolders } from ".";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

interface FileDropDownProps {
    setDropDownVisible: Dispatch<SetStateAction<boolean>>
}

export const FileDropDown = (props: FileDropDownProps) => {
    const queryClient = useQueryClient();
    const {setErrorMessage} = useErrors();
    const {setDialogVisible, setDialogProps} = useDialog();
    const {setDropDownVisible} = props;
    const {activeFile, dropDownPosition, dropDownVisible, setPreviewVisible} = useFiles();
    const {folderStackIDs} = useFolders();
    const {id, name, mimeType, variant, isCorrupted} = activeFile;

    const isFile = variant === "file";
    const isPreviewable = mimeType && (mimeType.startsWith("image/") || mimeType.startsWith("video/") || mimeType === "application/pdf");

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

    const handleFileDownload = async () => {
        setDropDownVisible(false);
        const res = await fetch(`/api/files/download?id=${id}&folderStackIDs=${encodeURIComponent(JSON.stringify(folderStackIDs))}`);

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

    const handleFolderDownload = async () => {
        setDropDownVisible(false);
        const res = await fetch(`/api/files/downloadFolder?folderId=${id}&folderStackIDs=${encodeURIComponent(JSON.stringify(folderStackIDs))}`);

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

    const handleDelete = () => {
        setDropDownVisible(false);
        if (variant === "file") {
            setDialogProps({headerText: `Are you sure you want to delete ${name}`, hasInput: false, onSubmit: handleFileDelete});
        } else {
            setDialogProps({headerText: `Are you sure you want to delete ${name}`, hasInput: false, onSubmit: handleFolderDelete});
        }
        setDialogVisible(true);
    }

    const handleFileDelete = async () => {
        setDialogVisible(false);
        const res = await fetch ("/api/files/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                folderStackIDs: folderStackIDs
            }),
        });

       if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        queryClient.invalidateQueries({queryKey: ["files"]});
        queryClient.invalidateQueries({queryKey: ["capacity"]});
    }

    const handleFolderDelete = async () => {
        setDialogVisible(false);
        const res = await fetch("/api/files/deleteFolder", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                folderId: id,
                folderStackIDs: folderStackIDs
            })
        });

        if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        queryClient.invalidateQueries({queryKey: ["folders"]});
        queryClient.invalidateQueries({queryKey: ["files"]});
        queryClient.invalidateQueries({queryKey: ["capacity"]});
    }


    const handleRename = () => {
        setDropDownVisible(false);
        if (variant === "file") {
            setDialogProps({headerText: "Enter new file name:", hasInput: true, onSubmit: handleFileRename});
        } else {
            setDialogProps({headerText: "Enter new folder name:", hasInput: true, onSubmit: handleFolderRename});
        }
        setDialogVisible(true);
    }

    const handleFileRename = async (newName: string) => {
        setDialogVisible(false);
        const res = await fetch ("/api/files/rename", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                oldName: name,
                newName: newName
            }),
        });

        if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        queryClient.invalidateQueries({queryKey: ["files"]});
    }

    const handleFolderRename = async (newName: string) => {
        setDialogVisible(false);

        const res = await fetch("/api/files/renameFolder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                newName: newName
            }),
        });

        if (!res.ok) {
            const resJSON = await res.json();
            setErrorMessage(resJSON.errMessage);
            return;
        }

        queryClient.invalidateQueries({queryKey: ["folders"]});
    };

    const openPreview = () => {
        if (!isPreviewable) return;
        setDropDownVisible(false);
        setPreviewVisible(true);
    }

    return (
        <>
        {dropDownVisible && (
            <div ref={dropdownRef} style={{ top: dropDownPosition.top, left: dropDownPosition.left }} className="flex flex-col fixed bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] w-36 p-1 border border-gray-100">
                {isPreviewable && 
                <button className={`flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md ${isCorrupted ? "text-gray-400" : "cursor-pointer hover:bg-gray-100"} transition-colors duration-100`} onClick={!isCorrupted ? openPreview : () => {}}>
                    <Image src={`${!isCorrupted ? "./fullscreen.svg" : "./fullscreen-gray.svg"}`} alt="preview-icon" width={16} height={16}/>
                    Preview
                </button>}
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-100" onClick={isFile ? handleFileDownload : handleFolderDownload}>
                    <Image src="/download.svg" alt="download-icon" width={16} height={16}/>
                    Download
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-100" onClick={handleRename}>
                    <Image src="/rename.svg" alt="rename-icon" width={16} height={16}/>
                    Rename
                </button>
                <div className="h-px bg-gray-100 my-1"/>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-red-50 text-red-500 cursor-pointer transition-colors duration-100" onClick={handleDelete}>
                    <Image src="/trash.svg" alt="delete-icon" width={16} height={16}/>
                    Delete
                </button>
            </div>
        )}
        </>
    );
};
