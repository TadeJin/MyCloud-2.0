"use client";

import { useState } from "react";
import { AuthFooterLink, FormError, FormInput, FormSubmit, HyperText, InputForm, useAsyncSubmit } from ".";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [agreedToPolicies, setAgreedToPolicies] = useState(false);
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
            onSuccess: async () => {
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

                <div className="flex w-[95%] ml-1 text-sm text-stone-500 dark:text-dark-text-idle select-none">
                    <input
                        type="checkbox"
                        checked={agreedToPolicies}
                        onChange={e => setAgreedToPolicies(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-stone-300 accent-stone-600 cursor-pointer shrink-0"
                    />
                    <span className="text-center">
                        I have read and agree to the{" "}
                        <HyperText href="/terms" target="_blank" color="text-stone-800 dark:text-dark-text-primary" className="font-semibold">
                            Terms of Service
                        </HyperText>{" "}
                        and{" "}
                        <HyperText href="/privacy" target="_blank" color="text-stone-800 dark:text-dark-text-primary" className="font-semibold">
                            Privacy Policy
                        </HyperText>
                    </span>
                </div>

                <FormSubmit disabled={(errorMessage !== "" || !agreedToPolicies) || email === "" || password === ""} isSubmitting={isSubmitting}>Register</FormSubmit>
            </form>

            <AuthFooterLink links={[{ text: "Already have an account?", href: "/", label: "Login here" }]} />
        </InputForm>
    );
};
