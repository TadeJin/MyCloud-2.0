"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface UploadContextType {
    isUploading: boolean,
    setIsUploading: Dispatch<SetStateAction<boolean>>,
}

const UploadContext = createContext<UploadContextType | null>(null);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <UploadContext.Provider value={{ isUploading, setIsUploading }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => {
    const ctx = useContext(UploadContext);
    if (!ctx) throw new Error("useUpload must be used within an UploadProvider");
    return ctx;
};
