"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface LogOutButtonProps {
    className?: string
}

export const LogOutButton = (props: LogOutButtonProps) => {
    const {className} = props;

    const css = "flex items-center justify-center p-1 bg-gray-100 rounded-md hover:bg-red-200 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 " + className;

    return <button className = {css} onClick = {() => signOut({ callbackUrl: "/" })}><Image src="arrow-out-right-square-half.svg" alt="logout-icon" width={20} height={20}/>Log out</button>
}
