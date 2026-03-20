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
        <div className="flex items-center justify-center absolute w-screen h-screen left-0 top-0">
            <div className="flex flex-col w-[30%] outline-2 outline-black relative">
                <form className="w-full" onSubmit={(e: React.SubmitEvent) => (e.preventDefault(), onSubmit(name))}>
                    <h2 className="text-center font-bold">{headerText}</h2>

                    {hasInput && <>
                        <input type="text" name="name" className="block p-1 outline-1 outline-black mx-auto" onChange={(e) => setName(e.target.value)}/>
                        {invalidFileName.test(name) && <p className="text-red-600 w-full text-center font-bold">Name contains forbidden characters!</p>}
                    </>}

                    <div className="flex w-full">
                        <button className="mr-auto p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" type="button" onClick={() => setDialogVisible(false)}>Back</button>
                        <button className="ml-auto p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-40" type="submit" disabled= {hasInput && invalidFileName.test(name)}>{hasInput ? "Submit" : "Confirm"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
