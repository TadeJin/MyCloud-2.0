"use client";

import { LogOutButton } from ".";
import { Dispatch, Ref, SetStateAction} from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface UserStatsProps {
    hide: Dispatch<SetStateAction<boolean>>,
    ref: Ref<HTMLDivElement>,
    hasSettings?: boolean
}

export const UserStats = (props: UserStatsProps) => {
    const {hide, ref, hasSettings} = props;

    const fetchUserEmail = async () => {
        const res = await fetch("/api/users/fetchUserData");
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
    }
    
    const {data} = useQuery({queryKey: ["userEmail"], queryFn: () => fetchUserEmail()});

    return (
        <div ref = {ref} className="flex flex-col border border-stone-200 shadow-lg rounded-xl w-64 absolute right-0 top-full mt-5 p-4 bg-white">
            <div className = "flex justify-center items-center right-0.5 top-0.5 cursor-pointer hover:bg-stone-100 rounded-full w-[24] h-[24] absolute transition" onClick={() => hide(false)}>
                <Image src="x.svg" alt="userStatsClose" height={20} width={20} />
            </div>
            <p className="font-bold text-center truncate">Welcome {data ? data.email : "Error fetching email"}</p>
            {hasSettings && 
            <button className="flex items-center justify-center relative p-1 bg-stone-50 border border-stone-200 rounded-md hover:bg-stone-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200" onClick={() => redirect("/settings")}>
                <Image src="./cog.svg" alt="cog-icon" width={20} height={20}/>
                Settings
            </button>}
            <LogOutButton className="mt-2"/>
        </div>
    );
}
