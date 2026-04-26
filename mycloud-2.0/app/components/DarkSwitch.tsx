"use client";

import { useLayoutEffect, useState } from "react";
import { MoonIcon, SunIcon } from ".";

export const DarkSwitch = () => {
    const [isDark, setIsDark] = useState(false);

    useLayoutEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const setMode = (dark: boolean) => {
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
    };

    return (
        <div className="relative flex bg-stone-100 dark:bg-dark-card border border-stone-300 dark:border-dark-border-strong rounded-lg p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.07)] dark:shadow-none w-fit">
            {/* Sliding pill */}
            <div 
                className="absolute top-0.5 bottom-0.5 left-0.5 bg-stone-900 dark:bg-stone-500 rounded-md shadow-sm transition-transform duration-150 ease-in-out"
                style={{
                width: "calc(50% - 2px)",
                    transform: isDark ? "translateX(100%)" : "translateX(0)",
                }}
            />

            {/* Sun — light mode */}
            <div
                className={`relative flex items-center justify-center cursor-pointer px-2.5 py-1.5 transition-colors duration-150
                    ${!isDark
                        ? "text-white"
                        : "text-stone-500 dark:text-dark-text-idle hover:text-stone-800 dark:hover:text-dark-text-primary"
                    }`}
                onClick={() => setMode(false)}
            >
                <SunIcon size={16} />
            </div>

            {/* Moon — dark mode */}
            <div
                className={`relative flex items-center justify-center cursor-pointer px-2.5 py-1.5 transition-colors duration-150
                    ${isDark
                        ? "text-white"
                        : "text-stone-500 dark:text-dark-text-idle hover:text-stone-800 dark:hover:text-dark-text-primary"
                    }`}
                onClick={() => setMode(true)}
            >
                <MoonIcon size={16} />
            </div>
        </div>
    );
};
