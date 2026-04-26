"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoIcon } from ".";
import { authClient } from "../lib/auth-client";
import { useTRPC } from "../lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { DarkSwitch } from ".";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const trpc = useTRPC();
    const createRootMutation = useMutation(trpc.users.createRootFolder.mutationOptions());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await authClient.signIn.email({
                /**
                 * The user email
                 */
                email,
                /**
                 * The user password
                 */
                password,
                /**
                 * A URL to redirect to after the user verifies their email (optional)
                 */
                callbackURL: "/storage",
                /**
                 * remember the user session after the browser is closed. 
                 * @default true
                 */
                rememberMe: rememberMe
        }, {
            onError: (ctx) => {
                setErrorMessage(ctx.error.message);
            },

            onSuccess: async () => {
                try {
                    await createRootMutation.mutateAsync();
                } catch (err) {
                    if (err instanceof TRPCClientError) {
                        setErrorMessage(err.message);
                    }
                }
            }
        });
    };

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
                        <h1 className="text-2xl font-bold text-stone-800 dark:text-dark-text-primary tracking-tight">Welcome back</h1>
                        <p className="text-sm text-stone-400 dark:text-dark-text-idle">Sign in to your account</p>
                    </div>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        className={inputClass}
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={e => { setEmail(e.target.value); setErrorMessage(""); }}
                    />
                    <input
                        className={inputClass}
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={e => { setPassword(e.target.value); setErrorMessage(""); }}
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
                    )}

                    <div className="flex gap-2 ml-1 items-center text-sm text-stone-500 dark:text-dark-text-idle select-none group">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-stone-300 accent-stone-600 cursor-pointer"
                        />
                        <span className="group-hover:text-stone-600 dark:group-hover:text-dark-text-secondary transition">Remember me</span>
                    </div>
                    <button
                        className="mt-1 p-3 rounded-lg bg-stone-800 dark:bg-dark-base dark:hover:bg-dark-hover dark:border dark:border-dark-border text-white font-semibold hover:bg-stone-700 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-gray-200"
                        disabled={errorMessage !== ""}
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                <div className="flex flex-col gap-1 text-sm text-stone-500 dark:text-dark-text-idle text-center">
                    <p>
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-stone-800 dark:text-dark-text-primary font-semibold underline underline-offset-2 hover:text-stone-600 dark:hover:text-dark-text-secondary transition">
                            Register here
                        </Link>
                    </p>
                    <p>
                        Forgot your password?{" "}
                        <Link href="/reset-password-form" className="text-stone-800 dark:text-dark-text-primary font-semibold underline underline-offset-2 hover:text-stone-600 dark:hover:text-dark-text-secondary transition">
                            Reset it here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};
