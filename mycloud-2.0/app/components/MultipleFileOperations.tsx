"use client";

import { ArchiveArrowDownIcon, SelectAllIcon, SelectManyIcon, SelectNoneIcon, TrashAltIcon, XIcon } from ".";
import { SelectOpButton, useDialog, useErrors, useFolders, useSpinners } from ".";
import { useFiles } from "./ActiveFileProvider";
import { DBFile } from "../types";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";
import { TRPCClientError } from "@trpc/client";

interface MultipleFileOperationsProps {
    column?: boolean
}

export const MultipleFileOperations = (props: MultipleFileOperationsProps) => {
    const {column} = props;
    const {selectActive, setSelectActive, clearSelectedFiles, selectedFilesIds, selectedFilesNames, addSelectedFileId, removeSelectedFileId, filter, searchString} = useFiles();
    const {setErrorMessage} = useErrors();
    const queryClient = useQueryClient();
    const {setDialogVisible, setDialogProps} = useDialog();
    const [selectedOpen, setSelectedOpen] = useState(false);
    const selectedRef = useRef<HTMLDivElement>(null);
    const {getOpenedFolderID} = useFolders()
    const {showSpinner, hideSpinner} = useSpinners();
    
    const trpc = useTRPC();
    const deleteSelectedMutation = useMutation(trpc.files.deleteSelected.mutationOptions());

    useEffect(() => {
        if (!selectedOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (selectedRef.current && !selectedRef.current.contains(e.target as Node)) {
                setSelectedOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedOpen, setSelectedOpen]);

    const activateSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setSelectActive(true);
    }

    const disableSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelectedFiles();
        setSelectActive(false);
    }

    const downloadSelected = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (selectedFilesIds.size === 0) {
            setErrorMessage("No files selected");
            return;
        }
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Downloading files");

        const res = await fetch("/api/downloads/downloadSelected", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ids: [...selectedFilesIds]})
        });

        if (!res.ok) {
            hideSpinner(actionId);
            setErrorMessage((await res.json()).errMessage);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "selected_files.zip";
        a.click();
        URL.revokeObjectURL(url);
        hideSpinner(actionId);
    }

    const openDeleteDialog = () => {
        if (selectedFilesIds.size === 0) {
            setErrorMessage("No files selected");
            return;
        }

        setDialogProps({headerText: `Are you sure you want to delete ${selectedFilesIds.size} selected files?`, hasInput: false, onSubmit: deleteSelected});
        setDialogVisible(true);
    }

    const deleteSelected = async () => {
        setDialogVisible(false);
        const actionId = crypto.randomUUID();
        showSpinner(actionId, "Deleting files");

        try {
            await deleteSelectedMutation.mutateAsync({ids: [...selectedFilesIds]});
        } catch (err) {
            if (err instanceof TRPCClientError) {
                hideSpinner(actionId);
                setErrorMessage(err.message);
                return;
            }
        }
        hideSpinner(actionId);
        clearSelectedFiles();
        queryClient.invalidateQueries(trpc.files.fetchFiles.queryFilter());
    }

    const selectAll = () => {
        const files: DBFile[] | undefined = queryClient.getQueryData(trpc.files.fetchFiles.queryKey({filter: filter, folderId: getOpenedFolderID(), searchString}));
        if (!files || files.length === 0) {
            return;
        }

        files.forEach((file) => {
            addSelectedFileId(file.id, file.name);
        });
    }

    return (
        <div className={`flex ${column ? "flex-col" : "ml-3"} gap-3 items-center`}>
            {selectActive &&
            <>
                <div className="relative">
                    <p className="text-xs md:text-base underline decoration-dotted decoration-stone-400 underline-offset-2 cursor-pointer dark:text-dark-text-primary" onClick={() =>{if(selectedFilesIds.size > 0) setSelectedOpen(true);}}>
                        {selectedFilesIds.size} files selected
                    </p>

                    {selectedFilesIds.size > 0 && selectedOpen && (
                        <div className={`absolute z-20 bg-white dark:bg-dark-dropdown border border-stone-200 dark:border-dark-border rounded-lg shadow-lg p-1.5 w-56 max-h-52 overflow-y-auto ${column ? "left-full top-0 ml-2" : "left-0 top-full mt-3"}`} ref={selectedRef}>
                            <p className="text-xs font-semibold dark:text-dark-text-secondary">Currently selected files:</p>
                            {[...selectedFilesNames.entries()].map(([id, name]) => (
                                <div key={id} className="flex items-center gap-2 py-1 px-2 rounded-md">
                                    <span className="text-xs text-stone-700 dark:text-dark-text-secondary truncate flex-1" title={name}>{name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeSelectedFileId(id); }}
                                        className="shrink-0 cursor-pointer hover:bg-stone-200 dark:hover:bg-dark-hover rounded-full p-0.5 transition-colors duration-100"
                                    >
                                        <XIcon size={12} className="dark:text-dark-text-primary"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <SelectOpButton text="Select all" icon={<SelectAllIcon className="dark:text-dark-text-primary"/>} onClick={selectAll} styles={column ? "w-[90%]" : ""} />
                <SelectOpButton text="Download selected" icon={<ArchiveArrowDownIcon className="dark:text-dark-text-primary"/>} onClick={downloadSelected} styles={column ? "w-[90%]" : ""}/>
                <SelectOpButton text="Delete selected" icon={<TrashAltIcon className="dark:text-dark-text-primary"/>} onClick={openDeleteDialog} styles={`hover:bg-red-50 hover:border-red-200 dark:hover:border-red-200/40 ${column ? "w-[90%]" : ""}`}/>
            </>
            }

            <SelectOpButton text={selectActive ? "Disable select" : "Select files"} icon={selectActive ? <SelectNoneIcon className="dark:text-dark-text-primary"/> : <SelectManyIcon className="dark:text-dark-text-primary"/>} onClick={!selectActive ? activateSelect : disableSelect} styles={column ? "w-[90%]" : ""} />
        </div>
    );
}
