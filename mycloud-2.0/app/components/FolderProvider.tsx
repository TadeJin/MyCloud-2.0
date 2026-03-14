"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface FolderContextType {
    folderStackIDs: number[];
    folderStackNames: string[];
    addFolder: (id: number, name: string) => void;
    removeFoldersUntil: (id: number) => void;
    getOpenedFolderID: () => number | null;
}

const FolderContext = createContext<FolderContextType | null>(null);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
    const [folderStackIDs, setFolderStackIDs] = useState<number[]>([]);
    const [folderStackNames, setFolderStackNames] = useState<string[]>([]);

    const addFolder = (id: number, name: string) => {
        setFolderStackNames(prev => [...prev, name]);
        setFolderStackIDs(prev => [...prev, id]);
    };

    const removeFoldersUntil = (id: number) => {
        if (id == -1) {
            setFolderStackIDs([]);
            setFolderStackNames([]);
        }

        const index = folderStackIDs.findIndex(item => item === id);
        setFolderStackIDs(prev => prev.slice(0, index + 1));
        setFolderStackNames(prev => prev.slice(0, index + 1));
    }

    const getOpenedFolderID = () => {
        if (folderStackIDs.length == 0) return null;

        return folderStackIDs[folderStackIDs.length - 1]
    }

    return (
        <FolderContext.Provider value={{ folderStackIDs, folderStackNames, addFolder, removeFoldersUntil, getOpenedFolderID }}>
            {children}
        </FolderContext.Provider>
    );
};

export const useFolders = () => {
    const ctx = useContext(FolderContext);
    if (!ctx) throw new Error("useFolders must be used within a FolderProvider");
    return ctx;
};
