"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { SpinnerDisplay } from ".";

interface SpinnerContextType {
    mainSpinnerVisible: boolean,
    setMainSpinnerVisible: Dispatch<SetStateAction<boolean>>,
    showSpinner: (header: string) => void,
    spinnerHeader: string,
    hideSpinner: () => void
}


const SpinnerContext = createContext<SpinnerContextType | null>(null);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
    const [spinnerHeader, setSpinnerHeader] = useState("");
    const [mainSpinnerVisible, setMainSpinnerVisible] = useState(false);

    const showSpinner = (header: string) => {
        setSpinnerHeader(header);
        setMainSpinnerVisible(true);
    }

    const hideSpinner = () => {
        setSpinnerHeader("");
        setMainSpinnerVisible(false);
    }

    return (
        <SpinnerContext.Provider value={{ spinnerHeader, showSpinner, mainSpinnerVisible, setMainSpinnerVisible, hideSpinner }}>
            {children}
            <SpinnerDisplay/>
        </SpinnerContext.Provider>
    );
}

export const useSpinners = () => {
    const ctx = useContext(SpinnerContext);
    if (!ctx) throw new Error("useSpinners must be used within a SpinnerProvider");
    return ctx;
};
