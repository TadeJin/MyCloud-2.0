"use client";
import { signOut } from "next-auth/react";

interface LogOutButtonProps {
    className?: string
}

export const LogOutButton = (props: LogOutButtonProps) => {
    const {className} = props;

    const css = "p-1 bg-gray-100 rounded-md hover:bg-blue-200 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 " + className;

    return <button className = {css} onClick = {() => signOut({ callbackUrl: "/" })}>Log out</button>
}
