"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { FileNameInputVariants } from "../types";

interface DropdownPosition {
    top: number,
    left: number
}

interface ActiveFile {
    id: number,
    name: string,
    variant: FileNameInputVariants,
    mimeType: string
}

interface FileContextType {
    
    activeFile: ActiveFile,
    setActiveFile:  Dispatch<SetStateAction<ActiveFile>>
    nameInputVisible: boolean,
    setNameInputVisible: Dispatch<SetStateAction<boolean>>
    dropDownVisible: boolean,
    setDropDownVisible: Dispatch<SetStateAction<boolean>>,
    dropDownPosition: DropdownPosition,
    setDropDownPosition: Dispatch<SetStateAction<DropdownPosition>>
}

const FileContext = createContext<FileContextType | null>(null);

export const ActiveFileProvider = ({ children }: { children: ReactNode }) => {
    const [activeFile, setActiveFile] = useState<ActiveFile>({id: -1, name: "", mimeType: "", variant: "file"});

    const [nameInputVisible, setNameInputVisible] = useState(false);
    const [dropDownVisible, setDropDownVisible] = useState(false);
    const [dropDownPosition, setDropDownPosition] = useState({ top: 0, left: 0 });
   

    return (
        <FileContext.Provider value={{  activeFile, setActiveFile, nameInputVisible, setNameInputVisible, dropDownVisible, setDropDownVisible, dropDownPosition, setDropDownPosition }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFiles = () => {
    const ctx = useContext(FileContext);
    if (!ctx) throw new Error("useFiles must be used within a ActiveFileProvider");
    return ctx;
};
