"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoIcon } from ".";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";
import { DarkSwitch } from ".";

export const RegisterForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const name = "";

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        await authClient.signUp.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            name,
            callbackURL: "/" // A URL to redirect to after the user verifies their email (optional)
        }, {
            onSuccess: async (ctx) => {
                router.push("/");
            },
            onError: (ctx) => {
                setErrorMessage(ctx.error.message);
        },})
    }

    const inputClass = "p-3 rounded-lg border border-stone-200 dark:border-dark-border bg-stone-50 dark:bg-dark-base text-stone-800 dark:text-dark-text-primary placeholder:text-stone-400 dark:placeholder:text-dark-text-idle focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-dark-border-focus transition";

    return (
        <div className="grid place-items-center h-screen bg-stone-100 dark:bg-dark-page relative">
            <div className="absolute top-4 right-4"><DarkSwitch /></div>
            <div className="flex flex-col gap-6 bg-white dark:bg-dark-card p-10 pt-3 rounded-2xl shadow-lg dark:shadow-none w-full max-w-sm">

                <div className="flex flex-col gap-5">
                    <div className="flex justify-center">
                        <LogoIcon className="w-[180px] h-[60px] dark:text-dark-text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 dark:text-dark-text-primary tracking-tight">Create an account</h1>
                        <p className="text-sm text-stone-400 dark:text-dark-text-idle">Sign up to get started</p>
                    </div>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        className={inputClass}
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={e => {setEmail(e.target.value); setErrorMessage("");}}
                    />
                    <input
                        className={inputClass}
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={e => {setPassword(e.target.value); if (e.target.value.length < 8) setErrorMessage("Password minimal length is 8 characters"); else setErrorMessage("");}}
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
                    )}

                    <button
                        className="mt-1 p-3 rounded-lg bg-stone-800 dark:bg-dark-base dark:hover:bg-dark-hover dark:border dark:border-dark-border text-white font-semibold hover:bg-stone-700 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-gray-200"
                        type="submit"
                        disabled={errorMessage !== ""}
                    >
                        Register
                    </button>
                </form>

                <div className="text-sm text-stone-500 dark:text-dark-text-idle text-center">
                    <p>
                        Already have an account?{" "}
                        <Link href="/" className="text-stone-800 dark:text-dark-text-primary font-semibold underline underline-offset-2 hover:text-stone-600 dark:hover:text-dark-text-secondary transition">
                            Login here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};
