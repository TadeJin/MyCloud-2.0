import { ReactNode } from "react";

interface ActionButtonProps {
    variant?: "default" | "danger";
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    children: ReactNode;
}

const VARIANT_CLASSES: Record<"default" | "danger", string> = {
    default: "hover:bg-stone-100 dark:hover:bg-dark-hover hover:border-stone-300 dark:hover:border-dark-border-strong",
    danger: "hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-300/40"
};

export const ActionButton = (props: ActionButtonProps) => {
    const {variant = "default", className, onClick, disabled, children} = props;

    return (
        <button
            className={`flex items-center bg-stone-50 dark:bg-dark-card border border-stone-200 dark:border-dark-border rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-100 dark:text-dark-text-primary ${VARIANT_CLASSES[variant]} ${className ?? ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
