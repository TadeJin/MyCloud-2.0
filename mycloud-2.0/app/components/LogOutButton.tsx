"use client";
import { signOut } from "next-auth/react";

interface LogOutButtonProps {
    className?: string
}

export const LogOutButton = (props: LogOutButtonProps) => {
    const {className} = props;

    const css = "p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer " + className;

    return <button className = {css} onClick = {() => signOut({ callbackUrl: "/" })}>Log out</button>
}
