"use client";

import { useCallback, useState } from "react";
import { FormError, FormInput, FormSubmit, LogoIcon, MycloudLogoSmallIcon, useAsyncSubmit, UserSettingsForm } from ".";
import { SettingsContentVariants } from "../types";
import { CapacityDisplay, SettingsMenu, useDialog, UserInfo } from "../components";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import { useTRPC } from "../lib/trpc/client";
import { useRouter } from "next/navigation";

export const SettingsPageUI = () => {
    const router = useRouter();
    const [content, setContent] = useState<SettingsContentVariants>("account");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailSuccessMessage, setEmailSuccessMessage] = useState("");
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
    const clearEmailSuccess = useCallback(() => setEmailSuccessMessage(""), []);
    const clearPasswordSuccess = useCallback(() => setPasswordSuccessMessage(""), []);
    const [accountDeleteError, setAccountDeleteError] = useState("")
    const { isSubmitting: isEmailSubmitting, submit: submitEmail } = useAsyncSubmit();
    const { isSubmitting: isPasswordSubmitting, submit: submitPassword } = useAsyncSubmit();
    const queryClient = useQueryClient();
    const {setDialogProps, setDialogVisible} = useDialog();

    const trpc = useTRPC();

    const {data, error} = useQuery(trpc.users.fetchUserData.queryOptions());

    const updateEmail = async () => {
        setEmailSuccessMessage("");

        await submitEmail(async () => {
            const {error} = await authClient.changeEmail({
                newEmail: newEmail,
            });

            if (error?.message) {
                setEmailError(error.message);
                return;
            }

            setNewEmail("");
            setEmailSuccessMessage("Check your inbox to approve");
            queryClient.invalidateQueries(trpc.users.fetchUserData.queryFilter());
        });
    }

    const updatePassword = async () => {
        setPasswordSuccessMessage("");

        await submitPassword(async () => {
            const { error } = await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: true,
            });

            if (error?.message) {
                setPasswordError(error.message);
                return;
            }

            setNewPassword("");
            setCurrentPassword("");
            setPasswordSuccessMessage("Password updated");
        });
    }

    const deleteAccount = async () => {
        setDialogVisible(false);

        const {error} = await authClient.deleteUser();

        if (error?.message) {
            setAccountDeleteError(error.message);
            return;
        }

        router.push("/");
    }

    const handleAccountDelete = () => {
        setDialogProps({onSubmit: deleteAccount, headerText: "Are you sure you want to delete your account?", hasInput: false});
        setDialogVisible(true);
    }

    const renderContent = () => {
        if (content === "account") {
            return (
                <div className="max-w-xl flex flex-col gap-8">
                    <h1 className="text-2xl font-bold text-stone-800 dark:text-dark-text-primary">Account settings</h1>

                    <UserSettingsForm
                        headerText="Email"
                        displayText={error ? "Error fetching email" : data?.email}
                        buttonText="Change"
                        isExpandable
                        onClose={clearEmailSuccess}
                    >
                        <form className="flex flex-col gap-3 pt-2 border-t border-stone-100 dark:border-dark-border-subtle" onSubmit={e => { e.preventDefault(); updateEmail(); }}>
                            <FormInput variant="email" value={newEmail} setValue={setNewEmail} placeholder="New email address" onChange={clearEmailSuccess} />
                            <FormError text={emailError} />
                            <div className="flex items-center gap-3">
                                <FormSubmit size="small" disabled={newEmail === ""} isSubmitting={isEmailSubmitting}>Save email</FormSubmit>
                                {emailSuccessMessage !== "" && emailError === "" && (
                                    <span className="text-sm text-stone-500 dark:text-dark-text-secondary font-bold">{emailSuccessMessage}</span>
                                )}
                            </div>
                        </form>
                    </UserSettingsForm>

                    <UserSettingsForm
                        headerText="Password"
                        displayText="••••••••"
                        buttonText="Change"
                        isExpandable
                        onClose={clearPasswordSuccess}
                    >
                        <form className="flex flex-col gap-3 pt-2 border-t border-stone-100 dark:border-dark-border-subtle" onSubmit={e => { e.preventDefault(); updatePassword(); }}>
                            <FormInput variant="password" value={currentPassword} setValue={setCurrentPassword} size="small" name="currentPassword" placeholder="Current password" onChange={clearPasswordSuccess}/>
                            <FormInput variant="password" value={newPassword} setValue={setNewPassword} size="small" name="newPassword" placeholder="New Password" setErrorMessage={setPasswordError} enforceMinPasswordLength onChange={clearPasswordSuccess}/>
                            <FormError text={passwordError} />
                            <div className="flex items-center gap-3">
                                <FormSubmit size="small" disabled={currentPassword === "" || newPassword === "" || passwordError !== ""} isSubmitting={isPasswordSubmitting}>Save password</FormSubmit>
                                {passwordSuccessMessage !== "" && passwordError === "" && (
                                    <span className="text-sm text-stone-500 dark:text-dark-text-secondary font-bold">{passwordSuccessMessage}</span>
                                )}
                            </div>
                        </form>
                    </UserSettingsForm>

                    <UserSettingsForm
                        headerText="Delete account"
                        displayText={
                            <>
                                <p><b>Permanently</b> delete your account and all data</p>
                                <FormError text={accountDeleteError} />
                            </>
                        }
                        buttonText="Delete account"
                        onExpand={handleAccountDelete}
                        styles={{
                            container: "bg-white dark:bg-dark-card rounded-xl border-2 border-red-200 dark:border-red-900/50 p-5 flex flex-col gap-4",
                            button: "text-sm text-red-500 border border-red-300 dark:border-red-900/50 rounded-lg px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-300/10 transition-colors cursor-pointer",
                        }}
                    />
                </div>
            );
        }

        if (content === "storage") {
            return (
                <div className="max-w-xl flex flex-col gap-8">
                    <h1 className="text-2xl font-bold text-stone-800 dark:text-dark-text-primary">Storage settings</h1>

                    <div className="bg-white dark:bg-dark-card rounded-xl border border-stone-200 dark:border-dark-border p-4 flex flex-col">
                        <CapacityDisplay />
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl border border-stone-200 dark:border-dark-border p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-stone-400 dark:text-dark-text-idle uppercase font-semibold tracking-wide">Files stored</p>
                            <p className="text-stone-700 dark:text-dark-text-secondary mt-0.5">You have <span className="font-semibold text-stone-900 dark:text-dark-text-primary">{data?.fileCount}</span> files stored</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="flex w-screen h-screen dark:bg-dark-page">
            <div className="flex flex-col w-16 md:w-[17%] h-full items-center justify-between gap-10 shrink-0 bg-stone-100 dark:bg-dark-base border-r border-stone-200 dark:border-dark-border">
                {/* Mobile */}
                <div className="w-15 h-15 relative block md:hidden cursor-pointer" onClick={() => router.push("/")}>
                    <MycloudLogoSmallIcon className="w-full h-full object-contain" />
                </div>

                {/* Viewport => md */}
                <div className="relative w-[85%] h-14 hidden md:block mt-1 cursor-pointer" onClick={() => router.push("/")}>
                    <LogoIcon className="object-contain w-full h-full dark:text-dark-text-primary" />
                </div>
                <SettingsMenu content={content} setContent={setContent}/>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex w-full h-16 items-center px-4 border-b border-stone-200 dark:border-dark-border-subtle bg-stone-100 dark:bg-dark-base backdrop-blur-sm relative">
                    <UserInfo/>
                </div>

                <div className="w-full h-full bg-stone-50 dark:bg-dark-page p-4 md:p-10 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
