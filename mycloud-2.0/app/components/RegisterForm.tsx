"use client";

import { useState } from "react";
import { AuthFooterLink, FormError, FormInput, FormSubmit, InputForm, useAsyncSubmit } from ".";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { isSubmitting, submit } = useAsyncSubmit();
    const name = "";

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        await submit(() => authClient.signUp.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            name,
            callbackURL: "/?reason=email-verified" // A URL to redirect to after the user verifies their email (optional)
        }, {
            onSuccess: async (ctx) => {
                router.push("/?reason=registered");
            },
            onError: (ctx) => {
                setErrorMessage(ctx.error.message);
            },
        }));
    }

    return (
        <InputForm header="Create an account" subheader="Sign up to get started">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <FormInput variant="email" setValue={setEmail} setErrorMessage={setErrorMessage}/>
                <FormInput variant="password" setValue={setPassword} setErrorMessage={setErrorMessage} enforceMinPasswordLength/>

                <FormError text={errorMessage} bold />

                <FormSubmit disabled={errorMessage !== ""} isSubmitting={isSubmitting}>Register</FormSubmit>
            </form>

            <AuthFooterLink links={[{ text: "Already have an account?", href: "/", label: "Login here" }]} />
        </InputForm>
    );
};
