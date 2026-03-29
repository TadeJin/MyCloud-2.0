"use client";

import { FileDisplay, FilePreview, NavBar, SideBar } from "."

export const StoragePageUI = () => {
    return (
        <div className="flex flex-row relative w-screen h-screen">
            <SideBar />
            <div className="flex flex-col h-screen w-screen">
                <NavBar />
                <FileDisplay className="pl-10 pt-5"/>
            </div>
            <FilePreview />
        </div>
    )
}
