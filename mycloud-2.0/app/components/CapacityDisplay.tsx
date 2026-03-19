"use client";

import { useQuery } from "react-query";
import { ProgressBar } from ".";

export const CapacityDisplay = () => {
    const fetchCapacity = async () => {
        const res = await fetch("/api/files/fetchCapacity");
        return res.json();
    };

    const convertToText = (byteCapacity: number) => {
        const gbSize = 1024 * 1024 * 1024;
        const mbSize = 1024 * 1024;

        if (byteCapacity >= gbSize) return `${(byteCapacity / gbSize).toFixed(2)} GB`;

        return `${(byteCapacity / mbSize).toFixed(2)} MB`
    };

    const { data: capacity, status: statusCapacity } = useQuery(["capacity"], fetchCapacity);
    let text = "";
    let percentage = 0;

    if (statusCapacity === "loading") {
        text = "Loading available storage"; 
    } else if (statusCapacity === "error" || !capacity) {
        text = "Error occured while getting capacity";
    } else {
        text = `You have used ${convertToText(capacity.taken)} from ${convertToText(capacity.maxCapacity)} capacity`;
        percentage = (capacity.taken * 100) / capacity.maxCapacity;
    }

    return (
        <div className="flex flex-col items-center">
            <p className="font-bold">Storage capacity</p>
            <ProgressBar percentage={percentage}/>
            <p className="text-xs">{text}</p>
        </div>
    )
};
