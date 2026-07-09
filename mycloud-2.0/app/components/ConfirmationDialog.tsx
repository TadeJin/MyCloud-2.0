"use client";

import { useState } from "react";
import { ConfirmationDialogProps } from "../types";
import { useDialog } from "./DialogProvider";
import { FormInput } from "./FormInput";
import { DialogButton } from "./DialogButton";


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
                        <div className="flex flex-col mx-auto w-[60%] mb-2">
                            <FormInput variant="text" size="small" name="name" value={name} setValue={setName} />
                        </div>
                        {invalidFileName.test(name) && <p className="text-red-500 w-full text-center font-bold mb-2">Name contains forbidden characters!</p>}
                    </>}

                    <div className="flex w-full justify-between">
                        <DialogButton onClick={() => setDialogVisible(false)}>Back</DialogButton>
                        <DialogButton type="submit" disabled={hasInput && invalidFileName.test(name)}>{hasInput ? "Submit" : "Confirm"}</DialogButton>
                    </div>
                </form>
            </div>
        </div>
    )
};
