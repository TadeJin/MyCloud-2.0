import { memo } from "react";
import { SpinnerIcon } from "./Icons";

type FormSubmitSize = "default" | "small";

interface FormSubmitProps {
    children: React.ReactNode;
    disabled?: boolean;
    isSubmitting?: boolean;
    size?: FormSubmitSize;
}

export const FormSubmit = memo(({ children, disabled, isSubmitting, size }: FormSubmitProps) => {
    const isSmall = size === "small";
    const sizeStyles = isSmall ? "self-start px-4 py-2 text-sm" : "mt-1 p-3 font-semibold";

    return (
        <button
            className={`${sizeStyles} rounded-lg bg-stone-800 dark:bg-dark-base dark:hover:bg-dark-hover dark:border dark:border-dark-border text-white hover:bg-stone-700 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-gray-200 dark:disabled:bg-dark-hover dark:disabled:text-dark-text-idle flex items-center justify-center gap-2`}
            type="submit"
            disabled={disabled || isSubmitting}
        >
            {isSubmitting && <SpinnerIcon size={isSmall ? 14 : 18} />}
            {children}
        </button>
    );
});

FormSubmit.displayName = "FormSubmit";
