"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { useDialog, useErrors, useFiles, useSpinners } from ".";
import { DownloadIcon, FullscreenIcon, RenameIcon, TrashIcon } from ".";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";
import { TRPCClientError } from "@trpc/client";

interface FileDropDownProps {
    setDropDownVisible: Dispatch<SetStateAction<boolean>>
}

export const FileDropDown = (props: FileDropDownProps) => {
    const queryClient = useQueryClient();
    const {setErrorMessage} = useErrors();
    const {setDialogVisible, setDialogProps} = useDialog();
    const {setDropDownVisible} = props;
    const {activeFile, dropDownPosition, dropDownVisible, setPreviewVisible} = useFiles();
    const {id, name, mimeType, variant, isCorrupted} = activeFile;

    const trpc = useTRPC();
    const deleteFileMutation = useMutation(trpc.files.delete.mutationOptions());
    const deleteFolderMutation = useMutation(trpc.files.deleteFolder.mutationOptions());
    const renameFileMutation = useMutation(trpc.files.rename.mutationOptions());
    const renameFolderMutation = useMutation(trpc.files.renameFolder.mutationOptions());
    const {showSpinner, hideSpinner} = useSpinners();

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
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Downloading file");
    
        const res = await fetch(`/api/downloads/download?id=${id}`);

        if (!res.ok) {
            hideSpinner(actionId);
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
        hideSpinner(actionId);
    }

    const handleFolderDownload = async () => {
        setDropDownVisible(false);
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Downloading folder");
        const res = await fetch(`/api/downloads/downloadFolder?folderId=${id}`);

        if (!res.ok) {
            hideSpinner(actionId);
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
        hideSpinner(actionId);
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
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Deleting file");

        try {
            await deleteFileMutation.mutateAsync({id: id});
        } catch (err) {
            if (err instanceof TRPCClientError) {
                hideSpinner(actionId);
                setErrorMessage(err.message);
                return
            }
        }

        hideSpinner(actionId);
        queryClient.invalidateQueries(trpc.files.fetchFiles.queryFilter());
        queryClient.invalidateQueries(trpc.users.fetchCapacity.queryFilter());
    }

    const handleFolderDelete = async () => {
        setDialogVisible(false);
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Deleting folder");
        
        try {
            await deleteFolderMutation.mutateAsync({id: id});
        } catch (err) {
            if (err instanceof TRPCClientError) {
                hideSpinner(actionId);
                setErrorMessage(err.message);
                return;
            }
        }

        hideSpinner(actionId);
        queryClient.invalidateQueries(trpc.files.fetchFiles.queryFilter());
        queryClient.invalidateQueries(trpc.files.fetchFolders.queryFilter());
        queryClient.invalidateQueries(trpc.users.fetchCapacity.queryFilter());
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
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Renaming file");
        
        try {
            await renameFileMutation.mutateAsync({id: id, oldName: name, newName: newName});
        } catch(err) {
            if (err instanceof TRPCClientError) {
                hideSpinner(actionId);
                setErrorMessage(err.message);
                return;
            }
        }

        hideSpinner(actionId);
        queryClient.invalidateQueries(trpc.files.fetchFiles.queryFilter());
    }

    const handleFolderRename = async (newName: string) => {
        setDialogVisible(false);
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Renaming folder");

        try {
            await renameFolderMutation.mutateAsync({id: id, oldName: name, newName: newName});
        } catch(err) {
            if (err instanceof TRPCClientError) {
                hideSpinner(actionId);
                setErrorMessage(err.message);
                return;
            }
        }

        hideSpinner(actionId);
        queryClient.invalidateQueries(trpc.files.fetchFolders.queryFilter());
    };

    const openPreview = () => {
        if (!isPreviewable) return;
        setDropDownVisible(false);
        setPreviewVisible(true);
    }

    return (
        <>
        {dropDownVisible && (
            <div ref={dropdownRef} style={{ top: dropDownPosition.top, left: dropDownPosition.left }} className="flex flex-col fixed bg-white dark:bg-dark-dropdown rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] w-36 p-1 border border-gray-100 dark:border-dark-border">
                {isPreviewable && 
                <button className={`flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md ${isCorrupted ? "text-gray-400 dark:text-dark-text-faint" : "cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text-primary"} transition-colors duration-100`} onClick={!isCorrupted ? openPreview : () => {}}>
                    <FullscreenIcon size={16} className={isCorrupted ? "text-[#99a1af] dark:text-dark-text-idle" : ""} />
                    Preview
                </button>}
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 dark:hover:bg-dark-hover cursor-pointer transition-colors duration-100 dark:text-dark-text-primary" onClick={isFile ? handleFileDownload : handleFolderDownload}>
                    <DownloadIcon size={16} />
                    Download
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 dark:hover:bg-dark-hover cursor-pointer transition-colors duration-100 dark:text-dark-text-primary" onClick={handleRename}>
                    <RenameIcon size={16} />
                    Rename
                </button>
                <div className="h-px bg-gray-100 dark:bg-dark-border-subtle my-1"/>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-red-50 dark:hover:bg-red-300/40 text-red-500 cursor-pointer transition-colors duration-100" onClick={handleDelete}>
                    <TrashIcon size={16} />
                    Delete
                </button>
            </div>
        )}
        </>
    );
};
