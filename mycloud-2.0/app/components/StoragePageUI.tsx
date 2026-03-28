"use client";

import { Session } from "next-auth"
import { FileDisplay, FilePreview, NavBar, SideBar } from "."

interface StoragePageUIProps {
    session: Session
}

export const StoragePageUI = (props: StoragePageUIProps) => {
    const {session} = props;

    return (
        <div className="flex flex-row relative w-screen h-screen">
            <SideBar />
            <div className="flex flex-col h-screen w-screen">
                <NavBar session= {session} />
                <FileDisplay className="pl-10 pt-5"/>
            </div>
            <FilePreview />
        </div>
    )
}
