"use client";

import { useQueryClient } from "react-query";
import { SelectOpButton, useDialog, useErrors, useFolders } from ".";
import { useFiles } from "./ActiveFileProvider";
import { DisplayFile } from "../types";

interface MultipleFileOperationsProps {
    column?: boolean
}

export const MultipleFileOperations = (props: MultipleFileOperationsProps) => {
    const {column} = props;
    const {selectActive, setSelectActive, setSelectedFilesIds, selectedFilesIds, searchString, addSelectedFileId} = useFiles();
    const {setErrorMessage} = useErrors();
    const queryClient = useQueryClient();
    const {getOpenedFolderID} = useFolders();
    const {setDialogVisible, setDialogProps} = useDialog();

    const activateSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setSelectActive(true);
    }

    const disableSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setSelectedFilesIds([]);
        setSelectActive(false);
    }

    const downloadSelected = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (selectedFilesIds.length === 0) {
            setErrorMessage("No files selected");
            return;
        }

        const res = await fetch("/api/files/downloadSelected",{
            method: "POST",
            headers:  {"Content-Type": "application/json"},
            body: JSON.stringify({ids: selectedFilesIds})
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
        if (selectedFilesIds.length === 0) {
            setErrorMessage("No files selected");
            return;
        }

        setDialogProps({headerText: `Are you sure you want to delete ${selectedFilesIds.length} selected files?`, hasInput: false, onSubmit: deleteSelected});
        setDialogVisible(true);
    }

    const deleteSelected = async () => {
        setDialogVisible(false);
        const res = await fetch("/api/files/deleteSelected", {
            method: "POST",
            headers:  {"Content-Type": "application/json"},
            body: JSON.stringify({ids: selectedFilesIds})
        });

        if (!res.ok) {
            setErrorMessage((await res.json()).errMessage);
            return;
        }
        setSelectedFilesIds([]);
        queryClient.invalidateQueries("files");
    }

    const selectAll = () => {
        const files = queryClient.getQueryData<DisplayFile[]>(["files", getOpenedFolderID(), searchString]);
        if (!files || files.length === 0) {
            return;
        }

        files.forEach((file) => {
            addSelectedFileId(file.id);
        });
    }

    return (
        <div className={`flex ${column ? "flex-col" : "ml-3"} gap-3  items-center`}>
            {selectActive &&
            <>
            <p className="text-xs md:text-base">{selectedFilesIds.length} files selected</p>
            <SelectOpButton text ="Select all" imgSrc="./select-all.svg" onClick={selectAll}/>
            <SelectOpButton text ="Download selected" imgSrc="./archive-arrow-down.svg" onClick={downloadSelected}/>
            <SelectOpButton text ="Delete selected" imgSrc="./trash-alt.svg" onClick={openDeleteDialog} styles="hover:bg-red-200"/>
            </>
            }

            <SelectOpButton text ={selectActive ? "Disable select" : "Select files"} imgSrc={selectActive ? "./select-none.svg" : "./select-many.svg"} onClick={!selectActive ? activateSelect : disableSelect}/>
        </div>
    );
}
