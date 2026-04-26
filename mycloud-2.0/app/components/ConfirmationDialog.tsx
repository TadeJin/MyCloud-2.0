"use client";

import { useState } from "react";
import { ConfirmationDialogProps } from "../types";
import { useDialog } from "./DialogProvider";


export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
    const {headerText, hasInput, onSubmit} = props;
    const {setDialogVisible} = useDialog();
    const [name, setName] = useState("");
    const invalidFileName = /[<>:"/\\|?*\x00-\x1F]/;

    return (
        <div className="flex items-center justify-center fixed inset-0 backdrop-blur-sm bg-black/40 p-2 z-20">
            <div className="flex flex-col w-full max-w-md p-6 bg-white dark:bg-dark-card shadow-2xl rounded-lg relative">
                <form className="w-full" onSubmit={(e: React.SubmitEvent) => (e.preventDefault(), onSubmit(name))}>
                    <h2 className="text-center font-bold mb-2 dark:text-dark-text-primary">{headerText}</h2>

                    {hasInput && <>
                        <input type="text" name="name" className="block mx-auto border w-[60%] h-8 mb-2 p-3 border-gray-300 dark:border-dark-border dark:bg-dark-base dark:text-dark-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setName(e.target.value)}/>
                        {invalidFileName.test(name) && <p className="text-red-600 w-full text-center font-bold mb-2">Name contains forbidden characters!</p>}
                    </>}

                    <div className="flex w-full justify-between">
                        <button className="p-1 w-16 bg-gray-100 dark:bg-dark-hover dark:text-dark-text-primary rounded-md hover:bg-blue-200 dark:hover:bg-dark-pill cursor-pointer shadow-md hover:shadow-lg transition-all duration-100" type="button" onClick={() => setDialogVisible(false)}>Back</button>
                        <button className="p-1 w-16 bg-gray-100 dark:bg-dark-hover dark:text-dark-text-primary rounded-md hover:bg-blue-200 dark:hover:bg-dark-pill cursor-pointer shadow-md hover:shadow-lg transition-all duration-100 disabled:opacity-40 disabled:bg-gray-300 disabled:cursor-not-allowed" type="submit" disabled= {hasInput && invalidFileName.test(name)}>{hasInput ? "Submit" : "Confirm"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
