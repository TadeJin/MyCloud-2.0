"use client";

import { LogOutButton } from ".";
import { Dispatch, Ref, SetStateAction} from "react";
import { CogIcon, XIcon } from ".";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";
import { useRouter } from "next/navigation";

interface UserStatsProps {
    hide: Dispatch<SetStateAction<boolean>>,
    ref: Ref<HTMLDivElement>,
    hasSettings?: boolean
}

export const UserStats = (props: UserStatsProps) => {
    const router = useRouter();
    const {hide, ref, hasSettings} = props;
    const trpc = useTRPC();
    const {data} = useQuery(trpc.users.fetchUserData.queryOptions());

    return (
        <div ref = {ref} className="flex flex-col border border-stone-200 dark:border-dark-border shadow-lg rounded-xl w-64 absolute right-3 top-full mt-6 p-4 bg-white dark:bg-dark-dropdown">
            <div className = "flex justify-center items-center right-0.5 top-0.5 cursor-pointer hover:bg-stone-100 dark:hover:bg-dark-hover rounded-full w-[24] h-[24] absolute transition dark:text-dark-text-primary" onClick={() => hide(false)}>
                <XIcon size={20} className="dark:text-dark-text-primary"/>
            </div>
            <p className="font-bold text-center truncate dark:text-dark-text-primary">Welcome {data ? data.email : "Error fetching email"}</p>
            {hasSettings &&
            <button className="flex items-center justify-center relative p-1 bg-stone-50 dark:bg-dark-card border border-stone-200 dark:border-dark-border rounded-md hover:bg-stone-200 dark:hover:bg-dark-hover cursor-pointer shadow-sm hover:shadow-md transition-all duration-100 dark:text-dark-text-primary" onClick={() => router.push("/settings")}>
                <CogIcon size={20} />
                Settings
            </button>}
            <LogOutButton className="mt-2"/>
        </div>
    );
}
