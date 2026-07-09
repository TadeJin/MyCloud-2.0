"use client";

import { memo } from "react";

interface DialogButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit";
    disabled?: boolean;
    onClick?: () => void;
}

export const DialogButton = memo(({ children, type = "button", disabled, onClick }: DialogButtonProps) => {
    return (
        <button
            className="p-1 w-16 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-all duration-100 disabled:opacity-40 disabled:cursor-not-allowed bg-stone-100 dark:bg-dark-hover text-stone-800 dark:text-dark-text-primary hover:bg-stone-200 dark:hover:bg-dark-pill"
            type={type}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
});

DialogButton.displayName = "DialogButton";
