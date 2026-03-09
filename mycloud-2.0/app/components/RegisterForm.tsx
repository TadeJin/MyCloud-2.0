"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            alert("Error registering")
            return
        }

        router.replace("/");
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col items-center gap-3 outline-2 outline-black p-3">
                <h1 className="font-bold">Register</h1>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input className = "p-1 outline-1 outline-black" type="email" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
                    <input className = "p-1 outline-1 outline-black" type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    <button className = "p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" type="submit">Register</button>
                </form>
                <div>
                    <p>Already have an account? <Link href="/" className="text-blue-800 underline font-bold">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};