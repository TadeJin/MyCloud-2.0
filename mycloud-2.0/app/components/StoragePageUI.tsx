"use client";

import { Session } from "next-auth"
import { FileDisplay, NavBar, SideBar } from "."

interface StoragePageUIProps {
    session: Session
}

export const StoragePageUI = (props: StoragePageUIProps) => {
    const {session} = props;

    return (
        <div className="flex flex-col relative w-screen h-screen">
            <NavBar session= {session} />
            <div className="flex flex-row h-[calc(100vh-48px)] w-screen">
                <SideBar />
                <FileDisplay className="pl-10 pt-5"/>
            </div>
        </div>
    )
}
