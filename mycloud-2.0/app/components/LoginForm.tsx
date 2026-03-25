"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        if (res?.ok) {
            router.replace("storage");
        }  else {
            setErrorMessage("Wrong login credentials");
        }
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
