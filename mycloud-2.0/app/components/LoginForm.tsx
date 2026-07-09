"use client";

import { useState } from "react";
import { AuthFooterLink, FormError, FormInput, FormSubmit, InputForm, useAsyncSubmit } from ".";
import { authClient } from "../lib/auth-client";
import { useTRPC } from "../lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useSearchParams } from "next/navigation";

const REASON_MESSAGES: Record<string, string> = {
    "registered": "Account created",
    "password-reset": "Password updated",
    "email-verified": "Email verified",
};

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const { isSubmitting, submit } = useAsyncSubmit();
    const trpc = useTRPC();
    const createRootMutation = useMutation(trpc.users.createRootFolder.mutationOptions());
    const searchParams = useSearchParams();
    const successMessage = REASON_MESSAGES[searchParams.get("reason") ?? ""];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await submit(() => authClient.signIn.email({
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
        }));
    };

    return (
        <InputForm header="Welcome back" subheader="Sign in to your account">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <FormInput variant="email" setValue={setEmail} setErrorMessage={setErrorMessage}/>
                <FormInput variant="password" setValue={setPassword} setErrorMessage={setErrorMessage}/>

                <FormError text={errorMessage} bold />

                <div className="flex gap-2 ml-1 items-center text-sm text-stone-500 dark:text-dark-text-idle select-none group">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-stone-300 accent-stone-600 cursor-pointer"
                    />
                    <span className="group-hover:text-stone-600 dark:group-hover:text-dark-text-secondary transition">Remember me</span>
                </div>
                <FormSubmit disabled={errorMessage !== ""} isSubmitting={isSubmitting}>Login</FormSubmit>
            </form>

            {successMessage && (
                <p className="text-sm text-stone-800 dark:text-dark-text-primary font-bold text-center">{successMessage}</p>
            )}

            <AuthFooterLink
                links={[
                    { text: "Don't have an account?", href: "/register", label: "Register here" },
                    { text: "Forgot your password?", href: "/reset-password-form", label: "Reset it here" },
                ]}
            />
        </InputForm>
    );
};
