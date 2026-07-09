"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFooterLink, FormError, FormInput, FormSubmit, InputForm, useAsyncSubmit } from ".";
import { authClient } from "../lib/auth-client";
import { useSearchParams } from "next/navigation";

interface ResetFormProps {
    variant: "email" | "password"
}

export const ResetForm = (props: ResetFormProps) => {
    const router = useRouter();
    let {variant} = props;
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    if (token) {
        variant = "password";
    }

    const isEmail = variant === "email";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [text, setText] = useState(isEmail ? "Enter the email address linked to your account" : "");
    const [errorMessage, setErrorMessage] = useState("");
    const { isSubmitting, submit } = useAsyncSubmit();

    const submitText = isEmail ? "Send email" : "Change Password";

    const handleSubmitEmail = async (e: React.SubmitEvent) => {
        e.preventDefault()

        await submit(() => authClient.requestPasswordReset({
            email,
            redirectTo: "/reset-password-form",
        }, {
            onSuccess: () => {
                setText("Check your email for a reset link");
            },
            onError: (ctx) => {
                setErrorMessage(ctx.error.message);
            },
        }));
    }

    const handleSubmitPassword = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!token) {
            setErrorMessage("Invalid reset url");
            return;
        }

        await submit(async () => {
            const {error} = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error?.message) {
                setErrorMessage(error.message);
                return;
            }

            router.replace("/?reason=password-reset");
        });
    }

    return (
        <InputForm
            header="Reset password"
            subheader={isEmail ? "Enter your email to receive a reset link" : "Enter your new password"}
            onLogoClick={() => router.replace("/")}
        >
            <form className="flex flex-col gap-3" onSubmit={isEmail ? handleSubmitEmail : handleSubmitPassword}>
                <FormInput variant={isEmail ? "email" : "password"} setValue={isEmail ? setEmail : setPassword} setErrorMessage={setErrorMessage} enforceMinPasswordLength/>

                <FormError text={errorMessage} bold />

                <FormSubmit disabled={errorMessage !== ""} isSubmitting={isSubmitting}>{submitText}</FormSubmit>
            </form>

            {text && (
                <p className="text-sm text-center font-medium dark:text-dark-text-secondary">{text}</p>
            )}

            <AuthFooterLink links={[{ text: "Remembered your password?", href: "/", label: "Login here" }]} />
        </InputForm>
    );
}
