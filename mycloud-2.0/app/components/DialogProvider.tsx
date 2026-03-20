"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { ConfirmationDialogProps } from "../types";
import { ConfirmationDialog } from ".";

type DialogContextType = {
    isDialogVisible: boolean,
    setDialogVisible: Dispatch<SetStateAction<boolean>>,
    dialogProps: ConfirmationDialogProps,
    setDialogProps: Dispatch<SetStateAction<ConfirmationDialogProps>>
}

const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialogProps, setDialogProps] = useState<ConfirmationDialogProps>({headerText: "", hasInput: false, onSubmit: (() => {})});
    const [isDialogVisible, setDialogVisible] = useState(false);
    const {headerText, hasInput, onSubmit} = dialogProps;

    return (
        <DialogContext.Provider value={{isDialogVisible, setDialogVisible, dialogProps, setDialogProps}}>
            {children}
            {isDialogVisible && (
                <ConfirmationDialog
                    headerText={headerText}
                    hasInput={hasInput}
                    onSubmit={onSubmit}
                />
            )}
        </DialogContext.Provider>
    )
}

export const useDialog = () => {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error("useDialog must be used within a DialogProvider");
    return ctx;
};
