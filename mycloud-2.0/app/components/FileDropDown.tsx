"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { useDialog, useErrors, useFiles } from ".";
import { useQueryClient } from "react-query";

interface FileDropDownProps {
    setDropDownVisible: Dispatch<SetStateAction<boolean>>
}

export const FileDropDown = (props: FileDropDownProps) => {
    const queryClient = useQueryClient();
    const {setErrorMessage} = useErrors();
    const {setDialogVisible, setDialogProps} = useDialog();
    const {setDropDownVisible} = props;
    const {activeFile, dropDownPosition, dropDownVisible} = useFiles();
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

    const handleFileDownload = async () => {
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

    const handleFolderDownload = async () => {
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

    const handleFolderDelete = async () => {
        setDialogVisible(false);
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

        queryClient.invalidateQueries("files");
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

        queryClient.invalidateQueries("folders");
    };

    return (
        <>
        {dropDownVisible && <div ref={dropdownRef} style={{ top: dropDownPosition.top, left: dropDownPosition.left }} className="flex flex-col fixed bg-white outline-2 outline-black rounded-md w-30 z-10">
            <button className="hover:bg-gray-600 cursor-pointer" onClick={isFile ? handleFileDownload : handleFolderDownload}>Download</button>
            <button className="hover:bg-gray-600 cursor-pointer" onClick={handleRename}>Rename</button> 
            <button className="hover:bg-gray-600 cursor-pointer" onClick={handleDelete}>Delete</button>
        </div>}
        </>
    )
};
