"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        });

        if (!res.ok) {
            setErrorMessage((await res.json()).errMessage);
            return
        }

        router.replace("/");
    }

    return (
        <div className="grid place-items-center h-screen bg-stone-100">
            <div className="flex flex-col gap-6 bg-white p-10 pt-3 rounded-2xl shadow-lg w-full max-w-sm">

                <div className="flex flex-col gap-5">
                    <div className="flex justify-center">
                        <Image src="/logo.svg" alt="mycloud-logo" width={180} height={60} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Create an account</h1>
                        <p className="text-sm text-stone-400">Sign up to get started</p>
                    </div>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={e => {setEmail(e.target.value); setErrorMessage("");}}
                    />
                    <input
                        className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={e => {setPassword(e.target.value); setErrorMessage("");}}
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
                    )}

                    <button
                        className="mt-1 p-3 rounded-lg bg-stone-800 text-white font-semibold hover:bg-stone-700 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-gray-200"
                        type="submit"
                        disabled={errorMessage !== ""}
                    >
                        Register
                    </button>
                </form>

                <div className="text-sm text-stone-500 text-center">
                    <p>
                        Already have an account?{" "}
                        <Link href="/" className="text-stone-800 font-semibold underline underline-offset-2 hover:text-stone-600 transition">
                            Login here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};