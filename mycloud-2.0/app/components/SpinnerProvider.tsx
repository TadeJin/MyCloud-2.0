"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { ProcessingActionsDisplay, SpinnerDisplay } from ".";

interface UserAction {
    id: string,
    header: string,
}

interface SpinnerContextType {
    mainSpinnerVisible: boolean,
    setMainSpinnerVisible: Dispatch<SetStateAction<boolean>>,
    showSpinner: (id: string, header: string) => void,
    spinnerHeader: string,
    hideSpinner: (id: string) => void,
    inBackgroundActions: UserAction[],
    addToBackground: (id: string, header: string) => void,
    removeBackgroundAction: (id: string) => void,
    currentActionId: string,
}

const SpinnerContext = createContext<SpinnerContextType | null>(null);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
    const [spinnerHeader, setSpinnerHeader] = useState("");
    const [mainSpinnerVisible, setMainSpinnerVisible] = useState(false);
    const [inBackgroundActions, setInBackgroundActions] = useState<UserAction[]>([]);
    const [currentActionId, setCurrentActionId] = useState("");

    const showSpinner = (id: string, header: string) => {
        setSpinnerHeader(header);
        setCurrentActionId(id);
        setMainSpinnerVisible(true);
    }

    const hideSpinner = (id: string) => {
        removeBackgroundAction(id);
        if (id === currentActionId) {
            setSpinnerHeader("");
            setMainSpinnerVisible(false);
        }
    }

    const addToBackground = (id: string, header: string) => {
        setInBackgroundActions(prev => [...prev, {id, header} ]);
    }

    const removeBackgroundAction = (id: string) => {
        setInBackgroundActions(prev => prev.filter(a => a.id !== id));
    }

    return (
        <SpinnerContext.Provider value={{ spinnerHeader, showSpinner, mainSpinnerVisible, setMainSpinnerVisible, hideSpinner, inBackgroundActions, addToBackground, removeBackgroundAction, currentActionId}}>
            {children}
            <SpinnerDisplay/>
            <ProcessingActionsDisplay />
        </SpinnerContext.Provider>
    );
}

export const useSpinners = () => {
    const ctx = useContext(SpinnerContext);
    if (!ctx) throw new Error("useSpinners must be used within a SpinnerProvider");
    return ctx;
};
