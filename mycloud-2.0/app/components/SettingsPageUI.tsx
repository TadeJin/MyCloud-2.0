"use client";

import { useState } from "react";
import { LogoIcon, MycloudLogoSmallIcon } from ".";
import { SettingsContentVariants } from "../types";
import { CapacityDisplay, SettingsMenu, useDialog, UserInfo } from "../components";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import { useTRPC } from "../lib/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";

export const SettingsPageUI = () => {
    const router = useRouter();
    const [content, setContent] = useState<SettingsContentVariants>("account");
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [accountDeleteError, setAccountDeleteError] = useState("")
    const queryClient = useQueryClient();
    const {setDialogProps, setDialogVisible} = useDialog();

    const trpc = useTRPC();
    const deleteAccountMutation = useMutation(trpc.users.deleteUserData.mutationOptions());

    const {data, error} = useQuery(trpc.users.fetchUserData.queryOptions());

    const updateEmail = async () => {
        const {error} = await authClient.changeEmail({
            newEmail: newEmail,
        });

        if (error?.message) {
            setEmailError(error.message);
            return;
        }

        setShowEmailInput(false);
        setNewEmail("");
        queryClient.invalidateQueries(trpc.users.fetchUserData.queryFilter());
    }

    const updatePassword = async () => {
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
        setShowPasswordInput(false);
    }

    const deleteAccount = async () => {
        setDialogVisible(false);

        try {
            await deleteAccountMutation.mutateAsync();
        } catch (err) {
            if (err instanceof TRPCClientError) {
                setAccountDeleteError(err.message);
                return;
            }
        }

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

    const inputClass = "border border-stone-300 dark:border-dark-border dark:bg-dark-base dark:text-dark-text-primary dark:placeholder-dark-text-idle rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-dark-border-focus";

    const renderContent = () => {
        if (content === "account") {
            return (
                <div className="max-w-xl flex flex-col gap-8">
                    <h1 className="text-2xl font-bold text-stone-800 dark:text-dark-text-primary">Account settings</h1>

                    <div className="bg-white dark:bg-dark-card rounded-xl border border-stone-200 dark:border-dark-border p-5 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-stone-400 dark:text-dark-text-idle uppercase font-semibold tracking-wide">Email</p>
                                <p className="text-stone-700 dark:text-dark-text-secondary mt-0.5">{error ? "Error fetching email" : data?.email}</p>
                            </div>
                            <button
                                onClick={() => { setShowEmailInput(v => !v); setShowPasswordInput(false); }}
                                className="text-sm text-stone-500 dark:text-dark-text-secondary border border-stone-300 dark:border-dark-border rounded-lg px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-dark-hover transition-colors cursor-pointer"
                            >
                                {showEmailInput ? "Cancel" : "Change"}
                            </button>
                        </div>

                        {showEmailInput && (
                            <div className="flex flex-col gap-3 pt-2 border-t border-stone-100 dark:border-dark-border-subtle">
                                <input
                                    type="email"
                                    placeholder="New email address"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className={inputClass}
                                />
                                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                                <button className="self-start bg-stone-800 dark:bg-dark-base dark:hover:bg-dark-hover dark:border dark:border-dark-border text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors cursor-pointer" onClick={updateEmail}>
                                    Save email
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl border border-stone-200 dark:border-dark-border p-5 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-stone-400 dark:text-dark-text-idle uppercase font-semibold tracking-wide">Password</p>
                                <p className="text-stone-700 dark:text-dark-text-secondary mt-0.5">••••••••</p>
                            </div>
                            <button
                                onClick={() => { setShowPasswordInput(v => !v); setShowEmailInput(false); }}
                                className="text-sm text-stone-500 dark:text-dark-text-secondary border border-stone-300 dark:border-dark-border rounded-lg px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-dark-hover transition-colors cursor-pointer"
                            >
                                {showPasswordInput ? "Cancel" : "Change"}
                            </button>
                        </div>

                        {showPasswordInput && (
                            <div className="flex flex-col gap-3 pt-2 border-t border-stone-100 dark:border-dark-border-subtle">
                                <input
                                    type="password"
                                    placeholder="Current password"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className={inputClass}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={newPassword}
                                    onChange={e => {setNewPassword(e.target.value); if (e.target.value.length < 8) setPasswordError("New password length must be at least 8 characters"); else setPasswordError("");}}
                                    className={inputClass}
                                />
                                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                                <button className="self-start bg-stone-800 dark:bg-dark-base dark:hover:bg-dark-hover dark:border dark:border-dark-border text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-600" disabled={passwordError !== ""} onClick={updatePassword}>
                                    Save password
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl border-2 border-red-200 dark:border-red-900/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="text-xs text-stone-400 dark:text-dark-text-idle uppercase font-semibold tracking-wide">Delete account</p>
                            <p className="text-stone-700 dark:text-dark-text-secondary mt-0.5"><b>Permanently</b> delete your account and all data</p>
                            {accountDeleteError && <p className="text-red-500">{accountDeleteError}</p>}
                        </div>
                        <button className="text-sm text-red-500 border border-red-300 dark:border-red-900/50 rounded-lg px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-300/10 transition-colors cursor-pointer" onClick={handleAccountDelete}>
                            Delete account
                        </button>
                    </div>
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
