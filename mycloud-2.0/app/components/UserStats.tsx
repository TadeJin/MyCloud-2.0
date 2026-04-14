"use client";

import { LogOutButton } from ".";
import { Dispatch, Ref, SetStateAction} from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";
import { useRouter } from "next/router";

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
        <div ref = {ref} className="flex flex-col border border-stone-200 shadow-lg rounded-xl w-64 absolute right-0 top-full mt-5 p-4 bg-white">
            <div className = "flex justify-center items-center right-0.5 top-0.5 cursor-pointer hover:bg-stone-100 rounded-full w-[24] h-[24] absolute transition" onClick={() => hide(false)}>
                <Image src="x.svg" alt="userStatsClose" height={20} width={20} />
            </div>
            <p className="font-bold text-center truncate">Welcome {data ? data.email : "Error fetching email"}</p>
            {hasSettings && 
            <button className="flex items-center justify-center relative p-1 bg-stone-50 border border-stone-200 rounded-md hover:bg-stone-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200" onClick={() => router.push("/")}>
                <Image src="./cog.svg" alt="cog-icon" width={20} height={20}/>
                Settings
            </button>}
            <LogOutButton className="mt-2"/>
        </div>
    );
}
