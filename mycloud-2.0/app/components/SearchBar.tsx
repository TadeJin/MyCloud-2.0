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
        <div className={`flex w-96 bg-white p-2 rounded-full gap-2 ${isFocused && "outline-2 outline-stone-700"} shadow-md`}> 
            <Image 
                src= "./search.svg"
                height={24}
                width={24}
                alt="search-icon"
            />
            <input type="text" placeholder="Search files..." className="focus:outline-none w-full" onChange={(e) => setSearch(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}></input>
        </div>
    )
};
