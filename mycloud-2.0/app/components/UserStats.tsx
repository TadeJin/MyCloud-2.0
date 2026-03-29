"use client";

import { LogOutButton } from ".";
import { Dispatch, Ref, SetStateAction} from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { redirect } from "next/navigation";

interface UserStatsProps {
    hide: Dispatch<SetStateAction<boolean>>,
    ref: Ref<HTMLDivElement>,
    hasSettings?: boolean
}

export const UserStats = (props: UserStatsProps) => {
    const {hide, ref, hasSettings} = props;

    const fetchUserEmail = async () => {
            return ((await fetch("/api/users/fetchUserData")).json());
        }
    
    const {data} = useQuery(["userEmail"], () => fetchUserEmail());

    return (
        <div ref = {ref} className="flex flex-col border border-gray-200 shadow-lg rounded-md w-64 absolute right-0 top-full mt-5 p-4 bg-white">
            <div className = "flex justify-center items-center right-0.5 top-0.5 cursor-pointer hover:bg-gray-200 rounded-full w-[24] h-[24] absolute transition" onClick={() => hide(false)}>
                <Image src="x.svg" alt="userStatsClose" height={20} width={20} />
            </div>
            <p className="font-bold text-center truncate">Welcome {data ? data.email : "Error fetching email"}</p>
            {hasSettings && 
            <button className="flex items-center justify-center relative p-1 bg-gray-100 rounded-md hover:bg-blue-200 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200" onClick={() => redirect("/settings")}>
                <Image src="./cog.svg" alt="cog-icon" width={20} height={20}/>
                Settings
            </button>}
            <LogOutButton className="mt-2"/>
        </div>
    )
}
