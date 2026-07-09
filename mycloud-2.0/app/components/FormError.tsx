import { memo } from "react";

interface FormErrorProps {
    text: string;
    bold?: boolean;
}

export const FormError = memo(({ text, bold }: FormErrorProps) => {
    if (!text) return null;

    return (
        <p className={`text-red-500 text-sm ${bold ? "font-bold" : ""}`}>{text}</p>
    );
});

FormError.displayName = "FormError";
