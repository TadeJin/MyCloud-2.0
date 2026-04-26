"use client";

import { SearchIcon, SliderIcon } from ".";
import { useEffect, useRef, useState } from "react";
import { useFiles } from "./ActiveFileProvider";
import { useFolders } from "./FolderProvider";
import { FilterOptions } from "../types";



export const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const {setSearchString, setFilter, filter} = useFiles();
    const {removeFoldersUntil} = useFolders();
    const [filterVisible, setFilterVisible] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!filterVisible) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setFilterVisible(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterVisible, setFilterVisible]);

    const setSearch = (value: string) => {
        setSearchString(value);
        removeFoldersUntil(-1);
    }

    const setFilterOption = (option: FilterOptions) => {
        setFilter(option);
        setFilterVisible(false);
    }

    return (
        <div className={`flex w-50 h-8 md:w-96 md:h-10 items-center bg-white dark:bg-dark-search p-2 rounded-full gap-2 ${isFocused ? "outline-2 outline-stone-700 dark:outline-dark-border-focus" : ""} shadow-md dark:shadow-none relative`}> 
            <SearchIcon className="w-5 h-5 md:w-6 md:h-6 dark:text-dark-text-primary" />
            <input type="text" placeholder="Search files..." className="focus:outline-none w-full text-xs md:text-base bg-transparent dark:placeholder-dark-text-primary dark:text-dark-text-primary" onChange={(e) => setSearch(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}></input>
            <div className="cursor-pointer hover:bg-stone-100 dark:hover:bg-dark-hover rounded-full p-1 transition-colors duration-150 dark:text-dark-text-secondary" onClick={() => setFilterVisible(!filterVisible)}>
                <SliderIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>

            {filterVisible &&
                <div className="flex flex-col absolute right-0 top-full bg-white dark:bg-dark-dropdown border dark:border-dark-border rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] w-full md:w-[60%] p-3 gap-2" ref={filterRef}>
                    <h2 className="font-semibold text-stone-700 dark:text-dark-text-secondary text-sm uppercase tracking-wide">Filter by type</h2>
                    <div className="flex flex-col gap-1">
                        {(["All", "Pictures", "Videos", "Documents", "Other"] as FilterOptions[]).map(option => (
                            <label key={option} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-dark-hover cursor-pointer transition-colors duration-150">
                                <input
                                    type="radio"
                                    name="fileType"
                                    value={option}
                                    checked={filter === option}
                                    onChange={() => setFilterOption(option)}
                                    className="accent-stone-800"
                                />
                                <span className="text-sm text-stone-700 dark:text-dark-text-secondary">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};
