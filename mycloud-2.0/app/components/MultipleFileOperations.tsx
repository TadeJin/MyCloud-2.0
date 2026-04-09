"use client";

import Image from "next/image";
import { SelectOpButton, useDialog, useErrors } from ".";
import { useFiles } from "./ActiveFileProvider";
import { DBFile } from "../types";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface MultipleFileOperationsProps {
    column?: boolean
}

export const MultipleFileOperations = (props: MultipleFileOperationsProps) => {
    const {column} = props;
    const {selectActive, setSelectActive, clearSelectedFiles, selectedFilesIds, selectedFilesNames, addSelectedFileId, removeSelectedFileId} = useFiles();
    const {setErrorMessage} = useErrors();
    const queryClient = useQueryClient();
    const {setDialogVisible, setDialogProps} = useDialog();
    const [selectedOpen, setSelectedOpen] = useState(false);
    const selectedRef = useRef<HTMLDivElement>(null);

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

        const res = await fetch("/api/files/downloadSelected", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ids: [...selectedFilesIds]})
        });

        if (!res.ok) {
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
        const res = await fetch("/api/files/deleteSelected", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ids: [...selectedFilesIds]})
        });

        if (!res.ok) {
            setErrorMessage((await res.json()).errMessage);
            return;
        }
        clearSelectedFiles();
        queryClient.invalidateQueries({queryKey: ["files"]});
    }

    const selectAll = () => {
        const files: DBFile[] | undefined = queryClient.getQueryData(["files"]);
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
                    <p className="text-xs md:text-base underline decoration-dotted decoration-stone-400 underline-offset-2 cursor-pointer" onClick={() =>{if(selectedFilesIds.size > 0) setSelectedOpen(true);}}>
                        {selectedFilesIds.size} files selected
                    </p>

                    {selectedFilesIds.size > 0 && selectedOpen && (
                        <div className={`absolute z-20 bg-white border border-stone-200 rounded-lg shadow-lg p-1.5 w-56 max-h-52 overflow-y-auto ${column ? "left-full top-0 ml-2" : "left-0 top-full mt-3"}`} ref={selectedRef}>
                            <p className="text-xs font-semibold">Currently selected files:</p>
                            {[...selectedFilesNames.entries()].map(([id, name]) => (
                                <div key={id} className="flex items-center gap-2 py-1 px-2 rounded-md">
                                    <span className="text-xs text-stone-700 truncate flex-1" title={name}>{name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeSelectedFileId(id); }}
                                        className="shrink-0 cursor-pointer hover:bg-stone-200 rounded-full p-0.5 transition-colors duration-100"
                                    >
                                        <Image src="/x.svg" alt="remove" width={12} height={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <SelectOpButton text="Select all" imgSrc="./select-all.svg" onClick={selectAll} styles="hover:bg-stone-100 hover:border-stone-300"/>
                <SelectOpButton text="Download selected" imgSrc="./archive-arrow-down.svg" onClick={downloadSelected} styles="hover:bg-stone-100 hover:border-stone-300"/>
                <SelectOpButton text="Delete selected" imgSrc="./trash-alt.svg" onClick={openDeleteDialog} styles="hover:bg-red-50 hover:border-red-200"/>
            </>
            }

            <SelectOpButton text={selectActive ? "Disable select" : "Select files"} imgSrc={selectActive ? "./select-none.svg" : "./select-many.svg"} onClick={!selectActive ? activateSelect : disableSelect} styles="hover:bg-stone-100 hover:border-stone-300"/>
        </div>
    );
}
