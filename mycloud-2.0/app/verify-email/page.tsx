"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(false);
    
    if (!token) redirect("/");

    const verifyEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const res = await fetch(`/api/auth/verifyEmail?token=${token}`);

        if (!res.ok) {
            setIsVerified(false);
            setError(true);
            return;
        }

        setIsVerified(true);
        setError(false);
    }

    const render = () => {
        if (!isVerified && !error) {
            return <button className="p-3 rounded-lg bg-stone-800 text-white font-semibold hover:bg-stone-700 transition cursor-pointer" onClick={(e) => verifyEmail(e)}>Verify email</button>
        }

        return (
            <div>
                <h1 className="text-2xl font-bold text-stone-800 tracking-tight">{error ? "Error verifying email" : "Email verified"}</h1>
                <p className="text-sm text-stone-400">{error ? "Make sure you are using the correct link" : <>You can log into your account <Link href="/" className="text-blue-700 underline font-bold">here</Link></>}</p>
            </div>
        )
    }


    return (
        <div className="grid place-items-center h-screen bg-stone-100">
            <div className="flex flex-col gap-6 bg-white p-10 pt-3 rounded-2xl shadow-lg w-full max-w-sm cursor-pointer" onClick={() => redirect("/")}>
                <div className="flex flex-col gap-5">
                    <div className="flex justify-center cur-pi" onClick={() => redirect("/")}>
                        <Image src="/logo.svg" alt="mycloud-logo" width={180} height={60} />
                    </div>
                    {render()}
                </div>
            </div>
        </div>
    );
}
