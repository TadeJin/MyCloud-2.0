"use client";

import { useSpinners } from "./SpinnerProvider"
import { ActionSpinnerContent, XIcon } from ".";


export const SpinnerDisplay = () => {
    const {spinnerHeader, mainSpinnerVisible, setMainSpinnerVisible, addToBackground, currentActionId} = useSpinners();

    const hideSpinner = () => {
        addToBackground(currentActionId, spinnerHeader);
        setMainSpinnerVisible(false);
    }

    if (!spinnerHeader) return null;
 
    if (mainSpinnerVisible) 
        return (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4 z-40" style={{ animation: "spinnerDelay 0s 300ms both" }}>
                <div className="flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-stone-200 dark:border-dark-border w-full max-w-sm overflow-hidden relative">
                    <div className="absolute right-1.5 top-1 cursor-pointer p-0.5 hover:bg-stone-200 dark:hover:bg-dark-hover rounded-full dark:text-dark-text-primary" onClick={() => hideSpinner()}><XIcon size={20} /></div>
                    <div className="flex items-center gap-3 bg-stone-50 dark:bg-dark-base border-b border-stone-100 dark:border-dark-border-subtle px-5 py-4">
                        <ActionSpinnerContent header={spinnerHeader} />
                    </div>
                </div>
            </div>
    );
}
