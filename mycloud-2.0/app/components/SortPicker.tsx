"use client";

import Image from "next/image";
import { SortPreference } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../lib/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useErrors } from "./ErrorProvider";

export const SortPicker = () => {
    const queryClient = useQueryClient();
    const {setErrorMessage} = useErrors();

    const trpc = useTRPC();
    const setPreferenceMutation = useMutation(trpc.users.setSortPreference.mutationOptions());

    const setPreference = async (preference: SortPreference) => {
        try {
            await setPreferenceMutation.mutateAsync({preference: preference});
        } catch (err) {
            if (err instanceof TRPCClientError) {
                setErrorMessage(err.message);
                return;
            }
        }


        queryClient.invalidateQueries(trpc.users.fetchSortPreference.queryFilter());
        queryClient.invalidateQueries(trpc.files.fetchFiles.queryFilter());
        queryClient.invalidateQueries(trpc.files.fetchFolders.queryFilter());
    }

    const {data} = useQuery(trpc.users.fetchSortPreference.queryOptions());

    const preference = data && data.sortPreference;

    // Layout math:
    // Container padding: p-1 = 4px each side
    // Divider: w-px (1px) + mx-2 (8px each side) = 17px total
    // Pill width: calc(50% - 12.5px)
    // Translate to "name": calc(100% + 17px)

    return (
        <div className="w-[90%] flex flex-col gap-2 border-t border-stone-300 pt-3">
            <p className="text-xs uppercase font-bold text-stone-500 md:text-sm">SORT BY</p>

            <div className="relative flex bg-stone-100 border border-stone-300 rounded-lg p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.07)]">
                {/* Sliding rectangular indicator */}
                <div
                    className="absolute top-1 bottom-1 left-1 bg-stone-900  rounded-lg shadow-sm transition-transform duration-200 ease-in-out"
                    style={{
                        width: "calc(50% - 12.5px)",
                        transform: preference === "name" ? "translateX(calc(100% + 17px))" : "translateX(0)"
                    }}
                />

                <div
                    className={`relative flex flex-1 items-center justify-center md:gap-1 cursor-pointer py-1.5 transition-colors duration-150 ${preference === "uploadedAt" ? "text-white" : "text-stone-600 hover:text-stone-800"}`}
                    onClick={() => setPreference("uploadedAt")}
                >
                    <Image src="./calendar-down-arrow.svg" alt="calendar-down-arrow" width={16} height={16} className={`transition-all duration-200 ${preference === "uploadedAt" ? "invert" : ""}`}/>
                    <p className="hidden md:block text-xs md:text-base">Date</p>
                </div>

                <div className="relative self-center h-5 w-px bg-stone-300 shrink-0 mx-2" />

                <div
                    className={`relative flex flex-1 items-center justify-center md:gap-1 cursor-pointer py-1.5 transition-colors duration-150 ${preference === "name" ? "text-white" : "text-stone-600 hover:text-stone-800"}`}
                    onClick={() => setPreference("name")}
                >
                    <Image src="./arrow-down-a-z.svg" alt="arrow-down-a-z.svg" width={16} height={16} className={`transition-all duration-200 ${preference === "name" ? "invert" : ""}`}/>
                    <p className="hidden md:block text-xs md:text-base">Name</p>
                </div>
            </div>
        </div>
    );
}
