"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { FileVariants, FilterOptions } from "../types";

interface DropdownPosition {
    top: number,
    left: number
}

interface ActiveFile {
    id: number,
    name: string,
    variant: FileVariants,
    mimeType: string,
    isCorrupted: boolean
}

interface FileContextType {
    
    activeFile: ActiveFile,
    setActiveFile:  Dispatch<SetStateAction<ActiveFile>>
    dropDownVisible: boolean,
    setDropDownVisible: Dispatch<SetStateAction<boolean>>,
    dropDownPosition: DropdownPosition,
    setDropDownPosition: Dispatch<SetStateAction<DropdownPosition>>,
    searchString: string,
    setSearchString: Dispatch<SetStateAction<string>>,
    filter: FilterOptions,
    setFilter: Dispatch<SetStateAction<FilterOptions>>,
    previewVisible: boolean,
    setPreviewVisible: Dispatch<SetStateAction<boolean>>,
    selectActive: boolean,
    setSelectActive: Dispatch<SetStateAction<boolean>>,
    selectedFilesIds: number[],
    addSelectedFileId: (id: number) => void,
    removeSelectedFileId: (id: number) => void,
    setSelectedFilesIds: Dispatch<SetStateAction<number[]>>
}

const FileContext = createContext<FileContextType | null>(null);

export const ActiveFileProvider = ({ children }: { children: ReactNode }) => {
    const [activeFile, setActiveFile] = useState<ActiveFile>({id: -1, name: "", mimeType: "", variant: "file", isCorrupted: false});
    const [searchString, setSearchString] = useState("");
    const [filter, setFilter] = useState<FilterOptions>("All");
    const [dropDownVisible, setDropDownVisible] = useState(false);
    const [dropDownPosition, setDropDownPosition] = useState({ top: 0, left: 0 });
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectActive, setSelectActive] = useState(false);
    const [selectedFilesIds, setSelectedFilesIds] = useState<number[]>([]);

    const addSelectedFileId = (id: number) => {
        setSelectedFilesIds(prev => [...prev, id]);
    }

    const removeSelectedFileId = (id: number) => {
        setSelectedFilesIds(prev => prev.filter(fileId => fileId !== id));
    }

    return (
        <FileContext.Provider value={{  
            activeFile, 
            setActiveFile, 
            dropDownVisible, 
            setDropDownVisible, 
            dropDownPosition, 
            setDropDownPosition, 
            searchString, 
            setSearchString,
            filter,
            setFilter,
            previewVisible, 
            setPreviewVisible,
            selectActive,
            setSelectActive,
            selectedFilesIds,
            addSelectedFileId,
            removeSelectedFileId,
            setSelectedFilesIds}}>
            {children}
        </FileContext.Provider>
    );
};

export const useFiles = () => {
    const ctx = useContext(FileContext);
    if (!ctx) throw new Error("useFiles must be used within a ActiveFileProvider");
    return ctx;
};
