"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            alert("Invalid email or password");
        }
    };

    return (
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col items-center gap-3 outline-2 outline-black p-3">
                <h1 className="font-bold">Login</h1>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input className = "p-1 outline-1 outline-black" type="email" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
                    <input className = "p-1 outline-1 outline-black" type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    <button className = "p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" type="submit">Login</button>
                </form>
                <div>
                    <p>Don&apos;t have an account? <Link href="/register" className="text-blue-800 underline font-bold">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};
