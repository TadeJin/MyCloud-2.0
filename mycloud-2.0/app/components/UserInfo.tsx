"use client";

import { useEffect, useRef, useState } from "react";
import { UserStats } from ".";
import Image from "next/image";

interface UserInfoProps {
    hasSettings?: boolean
}

export const UserInfo = (props: UserInfoProps) => {
    const {hasSettings} = props;
    const [visible, setVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setVisible(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [visible, setVisible]);
    

    return (
        <div className="flex flex-col absolute right-4">
            <div className = "ml-auto hover:cursor-pointer" onClick={() => setVisible(!visible)}>
                <Image src="/user.svg" alt="userIcon" height={24} width={24} />
            </div>
            {visible && <UserStats hasSettings={hasSettings} ref={dropdownRef} hide={setVisible} />}
        </div>
    )
};
