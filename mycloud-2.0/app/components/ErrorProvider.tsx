"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface ErrorContextType {
    errorMessage: string,
    setErrorMessage: (message: string) => void
}


const ErrorContext = createContext<ErrorContextType | null>(null);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState("");

    const setErrorMessage = (message: string) => {
        setMessage(message);
    }

    const errorMessage = message;

    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
            {children}
        </ErrorContext.Provider>
    );
}

export const useErrors = () => {
    const ctx = useContext(ErrorContext);
    if (!ctx) throw new Error("useFolders must be used within a FolderProvider");
    return ctx;
};
