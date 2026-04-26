"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoIcon } from ".";
import { authClient } from "../lib/auth-client";
import { DarkSwitch } from ".";
import { useSearchParams } from "next/navigation";

interface ResetFormProps {
    variant: "email" | "password"
}

export const ResetForm = (props: ResetFormProps) => {
    const router = useRouter();
    let {variant} = props;
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    if (token) {
        variant = "password";
    }

    const isEmail = variant === "email";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [text, setText] = useState(isEmail ? "Enter the email address linked to your account" : "");
    const [errorMessage, setErrorMessage] = useState("");

    let type = "";
    let submitText = "";

    if (isEmail) {
        type = "email";
        submitText = "Send email";
    } else {
        type = "password";
        submitText = "Change Password";
    }

    const handleSubmitEmail = async (e: React.SubmitEvent) => {
        e.preventDefault()

        await authClient.requestPasswordReset({
            email,
            redirectTo: "/reset-password-form",
        }, {
            onSuccess: () => {
                setText("Check your email for a reset link");
            },
            onError: (ctx) => {
                setErrorMessage(ctx.error.message);
            },
        });
    }

    const handleSubmitPassword = async (e: React.SubmitEvent) => {
        if (!token) {
            setErrorMessage("Invalid reset url");
            return;
        }

        const {error} = await authClient.resetPassword({
            newPassword: password,
            token,
        });

        if (error?.message) {
            setErrorMessage(error.message);
            return;
        }

        router.replace("/");
    }

    const inputClass = "p-3 rounded-lg border border-stone-200 dark:border-dark-border bg-stone-50 dark:bg-dark-base text-stone-800 dark:text-dark-text-primary placeholder:text-stone-400 dark:placeholder:text-dark-text-idle focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-dark-border-focus transition";

    return (
        <div className="grid place-items-center h-screen bg-stone-100 dark:bg-dark-page relative">
            <div className="absolute top-4 right-4"><DarkSwitch /></div>
            <div className="flex flex-col gap-6 bg-white dark:bg-dark-card p-10 pt-3 rounded-2xl shadow-lg dark:shadow-none w-full max-w-sm">

                <div className="flex justify-center cursor-pointer" onClick={() => router.replace("/")}>
                    <LogoIcon className="w-[180px] h-12 dark:text-dark-text-primary" />
                </div>

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-stone-800 dark:text-dark-text-primary tracking-tight">Reset password</h1>
                    <p className="text-sm text-stone-400 dark:text-dark-text-idle">{isEmail ? "Enter your email to receive a reset link" : "Enter your new password"}</p>
                </div>

                <form className="flex flex-col gap-3" onSubmit={isEmail ? handleSubmitEmail : handleSubmitPassword}>
                    <input
                        className={inputClass}
                        type={type}
                        name={type}
                        placeholder={isEmail ? "Email" : "Password"}
                        onChange={isEmail ? e => setEmail(e.target.value) : e => {setPassword(e.target.value); if (e.target.value.length < 8) setErrorMessage("Password too short"); else setErrorMessage("")}}
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
                    )}

                    <button
                        className="mt-1 p-3 rounded-lg bg-stone-800 dark:bg-dark-base dark:hover:bg-dark-hover dark:border dark:border-dark-border text-white font-semibold hover:bg-stone-700 transition cursor-pointer"
                        type="submit"
                    >
                        {submitText}
                    </button>
                </form>

                {text && (
                    <p className="text-sm text-center font-medium dark:text-dark-text-secondary">{text}</p>
                )}
            </div>
        </div>
    );
}
