"use client";

import { Dispatch, memo, SetStateAction, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "./Icons";

type FormInputVariant = "password" | "email" | "text";
type FormInputVariantSizes = "default" | "small";
interface PasswordInputProps {
    variant: FormInputVariant;
    size?: FormInputVariantSizes;
    value?: string;
    setValue: Dispatch<SetStateAction<string>>;
    setErrorMessage?: Dispatch<SetStateAction<string>>;
    enforceMinPasswordLength?: boolean;
    name?: string;
    placeholder?: string;
    onChange?: () => void;
}


export const FormInput = memo(({variant, value, setValue, setErrorMessage, enforceMinPasswordLength, size, name, placeholder, onChange}: PasswordInputProps) => {
    const isSmall = size === "small";
    const styles = `${isSmall ? "p-2" : "p-3"} ${isSmall ? "h-10" : "h-12.5"} rounded-lg border border-stone-200 dark:border-dark-border bg-stone-50 dark:bg-dark-base text-stone-800 dark:text-dark-text-primary placeholder:text-stone-400 dark:placeholder:text-dark-text-idle focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-dark-border-focus transition`;

    const [isVisible, setIsVisible] = useState(false);

    if (variant === "password") {
        return (
            <div className={`flex relative ${styles} items-center`}>
                <input
                    className="h-full w-full focus:outline-none"
                    type={isVisible ? "text" : "password"}
                    name={name ?? "password"}
                    placeholder={placeholder ?? "Password"}
                    value={value}
                    onChange={e => {setValue(e.target.value); if (setErrorMessage) if (enforceMinPasswordLength && e.target.value.length < 8) setErrorMessage("Password minimal length is 8 characters"); else setErrorMessage(""); onChange?.();}}
                />
                <div className={`${isSmall ? "p-0.5" : "p-1.5"} flex justify-center  items-center rounded-full cursor-pointer hover:bg-stone-200 dark:hover:bg-dark-hover`} onClick={() => setIsVisible(!isVisible)}>
                    {isVisible ? <EyeIcon size={isSmall ? 20 : 22}/> : <EyeSlashIcon size={isSmall ? 20 : 22} />}
                </div>
            </div>
        );
    }

    return (
        <input
            className={styles}
            type={variant}
            name={name ?? "email"}
            placeholder={!placeholder && variant === "email" ? "Email" : placeholder }
            value={value}
            onChange={e => {setValue(e.target.value); if (setErrorMessage) setErrorMessage(""); onChange?.();}}
        />
    );
});

FormInput.displayName = "FormInput";
