"use client";

import Image from "next/image";
import { useQuery, useQueryClient } from "react-query";
import { SortPreference } from "../types";

export const SortPicker = () => {
    const queryClient = useQueryClient();

    const fetchSortPreference = async () => {
        const res = await fetch("/api/users/fetchSortPreference");

        if (!res.ok) {
            return;
        }

        return res.json();
    }

    const setPreference = async (preference: SortPreference) => {
        await fetch(`/api/users/setSortPreference?preference=${preference}`);
        queryClient.invalidateQueries("sortPreference");
        queryClient.invalidateQueries("files");
        queryClient.invalidateQueries("folders");
    }

    const {data} = useQuery(["sortPreference"], () => fetchSortPreference());

    const preference = data && data.sortPreference;

    return ( 
        <div className="w-[90%] flex flex-col gap-2 border-t border-gray-400 pt-3">
            <p className="text-xs uppercase font-bold text-gray-500 md:text-sm">SORT BY</p>
            <div className="flex h-6 md:h-8">
                <div className={`flex items-center w-[50%] border border-stone-500 rounded-l-full p-0.5 md:p-2 md:gap-1 cursor-pointer ${preference === "uploadedAt" ? "bg-gray-400" : "hover:bg-blue-200"}`} onClick={() => setPreference("uploadedAt")}>
                    <Image src="./calendar-down-arrow.svg" alt="calendar-down-arrow" width={16} height={16}/>
                    <p className="text-xs md:text-base">Date</p>
                </div>

                <div className={`flex items-center w-[50%] border border-l-0 border-stone-500 rounded-r-full p-0.5 md:p-2 md:gap-1 cursor-pointer ${preference === "name" ? "bg-gray-400" : "hover:bg-blue-200"}`} onClick={() => setPreference("name")}>
                    <Image src="./arrow-down-a-z.svg" alt="arrow-down-a-z.svg" width={16} height={16}/>
                    <p className="text-xs md:text-base">Name</p>
                </div>
            </div>
        </div>
    );
}
