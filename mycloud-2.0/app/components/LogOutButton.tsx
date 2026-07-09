"use client";

import { ActionButton, ArrowOutRightSquareHalfIcon } from ".";
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
    <ActionButton variant="danger" className={"justify-center p-1 " + className} onClick={handleSignOut}>
            <ArrowOutRightSquareHalfIcon size={20} />
            Log out
    </ActionButton>
    );
}
