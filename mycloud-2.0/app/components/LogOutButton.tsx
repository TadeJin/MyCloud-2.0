"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface LogOutButtonProps {
    className?: string
}

export const LogOutButton = (props: LogOutButtonProps) => {
    const {className} = props;

    const css = "flex items-center justify-center p-1 bg-stone-50 border border-stone-200 rounded-md hover:bg-red-50 hover:border-red-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 " + className;

    return <button className = {css} onClick = {() => signOut({ callbackUrl: "/" })}><Image src="arrow-out-right-square-half.svg" alt="logout-icon" width={20} height={20}/>Log out</button>
}
