"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col items-center gap-3 outline-2 outline-black p-3">
                <h1 className="font-bold">Reset Password</h1>
                <form className="flex flex-col gap-3" onSubmit={isEmail ? handleSubmitEmail : handleSubmitPassword}>
                    <input className = "p-1 outline-1 outline-black" type={type} name={type} placeholder={isEmail ? "Email" : "Password"} onChange={isEmail ? e => setEmail(e.target.value) : (e) => setPassword(e.target.value)}/>
                    <button className = "p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" type="submit">{submitText}</button>
                </form>
                <div>{text}</div>
            </div>
        </div>
    );
}
