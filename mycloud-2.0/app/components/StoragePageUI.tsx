"use client";

import { useRef } from "react";
import { FileDisplay, FilePreview, NavBar, SideBar } from "."

export const StoragePageUI = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-row relative w-screen h-screen overflow-y-hidden bg-stone-50 dark:bg-dark-page">
            <SideBar fileInputRef={fileInputRef}/>
            <div className="flex flex-col h-screen flex-1 min-w-0">
                <NavBar />
                <FileDisplay fileInputRef={fileInputRef} className="pl-5 md:pl-10 pt-5"/>
            </div>
            <FilePreview />
        </div>
    )
}
