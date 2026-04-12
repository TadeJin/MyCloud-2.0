"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { SpinnerDisplay } from ".";

interface SpinnerContextType {
    spinnerHeader: string,
    setSpinnerHeader: Dispatch<SetStateAction<string>>,
}


const SpinnerContext = createContext<SpinnerContextType | null>(null);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
    const [spinnerHeader, setSpinnerHeader] = useState("");

    return (
        <SpinnerContext.Provider value={{ spinnerHeader, setSpinnerHeader }}>
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
