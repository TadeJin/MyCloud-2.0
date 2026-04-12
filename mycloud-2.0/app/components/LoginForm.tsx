"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { authClient } from "../lib/auth-client";
import { useTRPC } from "../lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";

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

    return (
        <div className="grid place-items-center h-screen bg-stone-100">
            <div className="flex flex-col gap-6 bg-white p-10 pt-3 rounded-2xl shadow-lg w-full max-w-sm">

                <div className="flex flex-col gap-5">
                    <div className="flex justify-center">
                        <Image src="/logo.svg" alt="mycloud-logo" width={180} height={60} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Welcome back</h1>
                        <p className="text-sm text-stone-400">Sign in to your account</p>
                    </div>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={e => { setEmail(e.target.value); setErrorMessage(""); }}
                    />
                    <input
                        className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={e => { setPassword(e.target.value); setErrorMessage(""); }}
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
                    )}

                    <div className="flex gap-2 ml-1 items-center text-sm text-stone-500 select-none group">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-stone-300 accent-stone-800 cursor-pointer"
                        />
                        <span className="group-hover:text-stone-700 transition">Remember me</span>
                    </div>
                    <button
                        className="mt-1 p-3 rounded-lg bg-stone-800 text-white font-semibold hover:bg-stone-700 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-gray-200"
                        disabled={errorMessage !== ""}
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                <div className="flex flex-col gap-1 text-sm text-stone-500 text-center">
                    <p>
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-stone-800 font-semibold underline underline-offset-2 hover:text-stone-600 transition">
                            Register here
                        </Link>
                    </p>
                    <p>
                        Forgot your password?{" "}
                        <Link href="/reset-password-form" className="text-stone-800 font-semibold underline underline-offset-2 hover:text-stone-600 transition">
                            Reset it here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};
