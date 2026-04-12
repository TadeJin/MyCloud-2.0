"use client";

import { useSpinners } from "./SpinnerProvider"

export const SpinnerDisplay = () => {
    const {spinnerHeader} = useSpinners();

    if (!spinnerHeader) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4 z-40">
            <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-sm overflow-hidden">
                <div className="flex items-center gap-3 bg-stone-50 border-b border-stone-100 px-5 py-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 shrink-0">
                        <svg
                            className="animate-spin w-[18px] h-[18px] text-stone-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                    </div>
                    <p className="font-semibold text-stone-700 text-sm tracking-wide uppercase">{spinnerHeader}</p>
                </div>
            </div>
        </div>
    )
}
