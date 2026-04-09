"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { SettingsContentVariants } from "../types";
import { CapacityDisplay, SettingsMenu, useDialog, UserInfo } from "../components";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const SettingsPageUI = () => {
    const [content, setContent] = useState<SettingsContentVariants>("account"); 
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [accountDeleteError, setAccountDeleteError] = useState("")
    const [passwordsMatching, setPasswordsMatching] = useState(false);
    const queryClient = useQueryClient();
    const {setDialogProps, setDialogVisible} = useDialog();

    const fetchUserData = async () => {
        return ((await fetch("/api/users/fetchUserData")).json());
    }

    const {data} = useQuery({queryKey: ['userData'], queryFn: () => fetchUserData()});

    const updateEmail = async () => {
        const res = await fetch("/api/users/updateEmail",{
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({newEmail: newEmail})
        });

        if (!res.ok) {
            setEmailError((await res.json()).errMessage);
            return;
        }

        setShowEmailInput(false);
        setNewEmail("");
        queryClient.invalidateQueries({queryKey: ["userData"]});
    }

    const updatePassword = async () => {
        if (!passwordsMatching) return;

        const res = await fetch("/api/users/updatePassword", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({newPassword: newPassword})
        });

        if (!res.ok) {
            setPasswordError((await res.json()).errMessage);
            return;
        }

        setNewPassword("");
        setConfirmPassword(""); 
        setShowPasswordInput(false);
    }

    const handlePasswordMatch = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value); 
        const matching = newPassword === e.target.value;
        setPasswordsMatching(matching);
        if (!matching) {
            setPasswordError("Passwords are not matching");
        } else {
            setPasswordError("");
        }
    }

    const deleteAccount = async () => {
        const res = await fetch("/api/users/deleteAccount", {
            method: "DELETE"
        });

        if (!res.ok) {
            setAccountDeleteError((await res.json()).errMessage);
            return;
        }

        await signOut({ callbackUrl: "/" });
    }

    const handleAccountDelete = () => {
        setDialogProps({onSubmit: deleteAccount, headerText: "Are you sure you want to delete your account?", hasInput: false});
        setDialogVisible(true);
    }

    const renderContent = () => {
        if (content === "account") {
            return (
                <div className="max-w-xl flex flex-col gap-8">
                    <h1 className="text-2xl font-bold text-stone-800">Account settings</h1>

                    <div className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                        <p className="text-xs text-stone-400 uppercase font-semibold tracking-wide">Email</p>
                        <p className="text-stone-700 mt-0.5">{data ? data.email : "Error fetching email"}</p>
                        </div>
                        <button
                        onClick={() => { setShowEmailInput(v => !v); setShowPasswordInput(false); }}
                        className="text-sm text-stone-500 border border-stone-300 rounded-lg px-3 py-1.5 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                        {showEmailInput ? "Cancel" : "Change"}
                        </button>
                    </div>

                    {showEmailInput && (
                        <div className="flex flex-col gap-3 pt-2 border-t border-stone-100">
                        <input
                            type="email"
                            placeholder="New email address"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            className="border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-400"
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                        <button className="self-start bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors cursor-pointer" onClick={updateEmail}>
                            Save email
                        </button>
                        </div>
                    )}
                    </div>

                    <div className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                        <p className="text-xs text-stone-400 uppercase font-semibold tracking-wide">Password</p>
                        <p className="text-stone-700 mt-0.5">••••••••</p>
                        </div>
                        <button
                        onClick={() => { setShowPasswordInput(v => !v); setShowEmailInput(false); }}
                        className="text-sm text-stone-500 border border-stone-300 rounded-lg px-3 py-1.5 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                        {showPasswordInput ? "Cancel" : "Change"}
                        </button>
                    </div>

                    {showPasswordInput && (
                        <div className="flex flex-col gap-3 pt-2 border-t border-stone-100">
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-400"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={e => handlePasswordMatch(e)}
                            className="border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-400"
                        />
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        <button className={`self-start bg-stone-800 text-white text-sm px-4 py-2 rounded-lg ${passwordsMatching ? "hover:bg-stone-700" : "hover:bg-stone-600"} transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-600`} disabled={!passwordsMatching} onClick={updatePassword}>
                            Save password
                        </button>
                        </div>
                    )}
                    </div>
                     <div className="bg-white rounded-xl border-2 border-red-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="text-xs text-stone-400 uppercase font-semibold tracking-wide">Delete account</p>
                            <p className="text-stone-700 mt-0.5"><b>Permanently</b> delete your account and all data</p>
                            {accountDeleteError && <p className="text-red-500">{accountDeleteError}</p>}
                        </div>
                        <button className="text-sm text-red-500 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors cursor-pointer" onClick={handleAccountDelete}>
                            Delete account
                        </button>
                    </div>
                </div>
            );
        }

        if (content === "storage") {
            return (
                <div className="max-w-xl flex flex-col gap-8">
                <h1 className="text-2xl font-bold text-stone-800">Storage settings</h1>

                <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col">
                    <CapacityDisplay />
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 flex items-center justify-between">
                    <div>
                    <p className="text-xs text-stone-400 uppercase font-semibold tracking-wide">Files stored</p>
                    <p className="text-stone-700 mt-0.5">You have <span className="font-semibold text-stone-900">{data.fileCount}</span> files stored</p>
                    </div>
                </div>
                </div>
            );
        }
    }

    return (
        <div className="flex w-screen h-screen">
            <div className="flex flex-col w-16 md:w-[17%] h-full items-center justify-between gap-10 shrink-0 bg-stone-100 border-r border-stone-200">
                {/* Mobile */}
                <div className="w-15 h-15 relative block md:hidden">
                    <Image 
                        src="./mycloud-logo-small.svg" 
                        alt="mycloud-logo" 
                        fill
                        onClick={() => redirect("/")} 
                        className="cursor-pointer"
                    />
                </div>

                {/* Viewport => md */}
                <div className="relative w-[85%] h-14 hidden md:block mt-1">
                    <Image
                        src="./logo.svg"
                        alt="mycloud-logo"
                        fill
                        onClick={() => redirect("/")}
                        className="cursor-pointer object-contain"
                    />
                </div>
                <SettingsMenu content={content} setContent={setContent}/>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex w-full h-16 items-center px-4 border-b border-stone-200 bg-stone-100 backdrop-blur-sm relative">
                    <UserInfo/>
                </div>

                <div className="w-full h-full bg-stone-50 p-4 md:p-10 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
