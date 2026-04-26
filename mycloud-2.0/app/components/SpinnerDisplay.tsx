"use client";

import { useSpinners } from "./SpinnerProvider"
import { XIcon } from ".";

export const SpinnerDisplay = () => {
    const {spinnerHeader, mainSpinnerVisible, setMainSpinnerVisible} = useSpinners();

    if (!spinnerHeader) return null;
 
    if (mainSpinnerVisible) 
        return (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4 z-40" style={{ animation: "spinnerDelay 0s 300ms both" }}>
                <div className="flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-stone-200 dark:border-dark-border w-full max-w-sm overflow-hidden relative">
                    <div className="absolute right-1.5 top-1 cursor-pointer p-0.5 hover:bg-stone-200 dark:hover:bg-dark-hover rounded-full dark:text-dark-text-primary" onClick={() => setMainSpinnerVisible(false)}><XIcon size={20} /></div>
                    <div className="flex items-center gap-3 bg-stone-50 dark:bg-dark-base border-b border-stone-100 dark:border-dark-border-subtle px-5 py-4">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 dark:bg-dark-hover shrink-0">
                            <svg
                                className="animate-spin w-[18px] h-[18px] text-stone-600 dark:text-dark-text-idle"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-stone-400 dark:text-dark-text-idle uppercase tracking-widest leading-none mb-1">In progress</p>
                            <p className="font-semibold text-stone-700 dark:text-dark-text-primary text-sm">{spinnerHeader}</p>
                        </div>
                    </div>
                </div>
            </div>
    );

    return (
        <div className="fixed flex items-center right-8 bottom-5 bg-white dark:bg-dark-card rounded-lg shadow-2xl border border-stone-200 dark:border-dark-border p-3 gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 dark:bg-dark-hover shrink-0">
                <svg
                    className="animate-spin w-[18px] h-[18px] text-stone-600 dark:text-dark-text-idle"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
            </div>
            <div>
                <p className="text-[10px] font-medium text-stone-400 dark:text-dark-text-idle uppercase tracking-widest leading-none mb-0.5">In progress</p>
                <p className="font-semibold text-stone-700 dark:text-dark-text-primary text-sm">{spinnerHeader}</p>
            </div>
        </div>
    );
}
