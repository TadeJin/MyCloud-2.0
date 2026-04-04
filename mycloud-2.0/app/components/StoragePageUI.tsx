"use client";

import { FileDisplay, FilePreview, NavBar, SideBar } from "."

export const StoragePageUI = () => {
    return (
        <div className="flex flex-row relative w-screen h-screen overflow-y-hidden">
            <SideBar />
            <div className="flex flex-col h-screen flex-1 min-w-0">
                <NavBar />
                <FileDisplay className="pl-5 md:pl-10 pt-5"/>
            </div>
            <FilePreview />
        </div>
    )
}
