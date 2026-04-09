"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

interface LogOutButtonProps {
    className?: string
}

export const LogOutButton = (props: LogOutButtonProps) => {
    const router = useRouter();
    const {className} = props;

    const css = "flex items-center justify-center p-1 bg-stone-50 border border-stone-200 rounded-md hover:bg-red-50 hover:border-red-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 " + className;

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                router.push("/"); // redirect to login page
                },
            },
        });
    }

    return <button className = {css} onClick = {handleSignOut}><Image src="arrow-out-right-square-half.svg" alt="logout-icon" width={20} height={20}/>Log out</button>
}
