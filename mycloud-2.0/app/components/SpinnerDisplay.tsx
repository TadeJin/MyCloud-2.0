"use client";

import { useSpinners } from "./SpinnerProvider"
import { SpinnerIcon, XIcon } from ".";


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
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 dark:bg-dark-hover shrink-0">
                            <SpinnerIcon />                            
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-stone-400 dark:text-dark-text-idle uppercase tracking-widest leading-none mb-1">In progress</p>
                            <p className="font-semibold text-stone-700 dark:text-dark-text-primary text-sm">{spinnerHeader}</p>
                        </div>
                    </div>
                </div>
            </div>
    );
}
