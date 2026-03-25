"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface ResetFormProps {
    variant: "email" | "password",
    token?: string | null
}

export const ResetForm = (props: ResetFormProps) => {
    const router = useRouter();
    const {variant, token} = props;

    const isEmail = variant === "email";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [text, setText] = useState(isEmail ? "Enter the email address linked to your account" : "");

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

        await fetch("/api/auth/sendResetEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
            }),
        })
        setText(`Email sent to ${email}. Please check your inbox`);
    }

    const handleSubmitPassword = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!token) return;

        await fetch("/api/auth/resetPassword", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: token,
                password: password
            })
        })
        router.replace("/");
    }

    return (
        <div className="grid place-items-center h-screen bg-stone-100">
            <div className="flex flex-col gap-6 bg-white p-10 pt-3 rounded-2xl shadow-lg w-full max-w-sm">

                <div className="flex justify-center">
                    <Image src="/logo.svg" alt="mycloud-logo" width={180} height={130} />
                </div>

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Reset password</h1>
                    <p className="text-sm text-stone-400">{isEmail ? "Enter your email to receive a reset link" : "Enter your new password"}</p>
                </div>

                <form className="flex flex-col gap-3" onSubmit={isEmail ? handleSubmitEmail : handleSubmitPassword}>
                    <input
                        className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                        type={type}
                        name={type}
                        placeholder={isEmail ? "Email" : "Password"}
                        onChange={isEmail ? e => setEmail(e.target.value) : e => setPassword(e.target.value)}
                    />

                    <button
                        className="mt-1 p-3 rounded-lg bg-stone-800 text-white font-semibold hover:bg-stone-700 transition cursor-pointer"
                        type="submit"
                    >
                        {submitText}
                    </button>
                </form>

                {text && (
                    <p className="text-sm text-center font-medium">{text}</p>
                )}
            </div>
        </div>
    );
}
