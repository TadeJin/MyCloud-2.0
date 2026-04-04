"use client";

import Image from "next/image";
import { useState } from "react";
import { useFiles } from "./ActiveFileProvider";
import { useFolders } from "./FolderProvider";

export const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const {setSearchString} = useFiles();
    const {removeFoldersUntil} = useFolders();

    const setSearch = (value: string) => {
        setSearchString(value);
        removeFoldersUntil(-1);
    }

    return (
        <div className={`flex w-50 h-8 md:w-96 md:h-10 items-center bg-white p-2 rounded-full gap-2 ${isFocused && "outline-2 outline-stone-700"} shadow-md`}> 
            <div className="h-5 w-5 md:w-6 md:h-6 relative">
                <Image 
                    src= "./search.svg"
                    alt="search-icon"
                    fill
                />
            </div>
            <input type="text" placeholder="Search files..." className="focus:outline-none w-full text-xs md:text-base" onChange={(e) => setSearch(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}></input>
        </div>
    )
};
