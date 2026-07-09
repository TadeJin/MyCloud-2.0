"use client";

import { ReactNode, useState } from "react";

interface UserSettingsFormStyles {
    container?: string;
    button?: string;
}

interface UserSettingsFormProps {
    headerText: string;
    displayText: ReactNode;
    buttonText: string;
    isExpandable?: boolean;
    onExpand?: () => void;
    styles?: UserSettingsFormStyles;
    children?: ReactNode;
    onClose?: () => void;
}

const DEFAULT_CONTAINER_STYLES = "bg-white dark:bg-dark-card rounded-xl border border-stone-200 dark:border-dark-border p-5 flex flex-col gap-4";
const DEFAULT_BUTTON_STYLES = "text-sm text-stone-500 dark:text-dark-text-secondary border border-stone-300 dark:border-dark-border rounded-lg px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-dark-hover transition-colors cursor-pointer";

export const UserSettingsForm = ({ headerText, displayText, buttonText, isExpandable, onExpand, styles, children, onClose }: UserSettingsFormProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (isExpandable) {
            if (isOpen) onClose?.();
            setIsOpen(!isOpen);
        } else {
            onExpand?.();
        }
    };

    return (
        <div className={styles?.container ?? DEFAULT_CONTAINER_STYLES}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-stone-400 dark:text-dark-text-idle uppercase font-semibold tracking-wide">{headerText}</p>
                    <div className="text-stone-700 dark:text-dark-text-secondary mt-0.5">{displayText}</div>
                </div>
                <button onClick={handleClick} className={styles?.button ?? DEFAULT_BUTTON_STYLES}>
                    {isExpandable && isOpen ? "Cancel" : buttonText}
                </button>
            </div>

            {isExpandable && isOpen && children}
        </div>
    );
};
