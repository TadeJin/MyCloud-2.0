"use client";
import { signOut } from "next-auth/react";

export const LogOutButton = async () => {
    return <button className = "p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" onClick = {() => signOut({ callbackUrl: "/" })}>Log out</button>
}
