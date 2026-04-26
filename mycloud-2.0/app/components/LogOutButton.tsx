"use client";

import { ArrowOutRightSquareHalfIcon } from ".";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

interface LogOutButtonProps {
    className?: string
}

export const LogOutButton = (props: LogOutButtonProps) => {
    const router = useRouter();
    const {className} = props;

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                router.push("/"); // redirect to login page
                },
            },
        });
    }

    return (
    <button 
    className = {"flex items-center justify-center p-1 bg-stone-50 dark:bg-dark-card border border-stone-200 dark:border-dark-border rounded-md " +
        "hover:bg-red-50 hover:border-red-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-100 dark:text-dark-text-primary dark:hover:bg-red-300/40 " + className} 
    onClick = {handleSignOut}>
            <ArrowOutRightSquareHalfIcon size={20} />
            Log out
    </button>
    );
}
