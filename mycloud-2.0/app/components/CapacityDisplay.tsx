"use client";

import { useQuery } from "react-query";
import { ProgressBar } from ".";

interface CapacityDisplayProps {
    hasTopBorder?: boolean
}

export const CapacityDisplay = (props: CapacityDisplayProps) => {
    const {hasTopBorder} = props;

    const GB_SIZE = 1024 * 1024 * 1024;
    const MB_SIZE = 1024 * 1024;

    const fetchCapacity = async () => {
        const res = await fetch("/api/files/fetchCapacity");
        return res.json();
    };

    const getUnit = (byteCapacity: number) => {

        if (byteCapacity >= GB_SIZE) return "GB";

        return "MB";
    };

    const convertToUnit = (byteCapacity: number) => {

        if (byteCapacity >= GB_SIZE) return (byteCapacity / GB_SIZE).toFixed(2);

        return (byteCapacity / MB_SIZE).toFixed(2);
    }

    const getBarColor = (percentage: number) => {
        if (percentage >= 90) return "bg-red-500";
        if (percentage >= 75) return "bg-orange-500";

        return "bg-blue-500";
    }

    const { data: capacity, status: statusCapacity } = useQuery(["capacity"], fetchCapacity);
    let takenStorage = 0;
    let maxCapacity = 0;
    let percentage = 0;
    let errText = "";

    if (statusCapacity === "loading") {
        errText = "Loading available storage"; 
    } else if (statusCapacity === "error" || !capacity) {
        errText = "Error occured while getting capacity";
    } else {
        takenStorage = capacity.taken;
        maxCapacity = capacity.maxCapacity;
        percentage = (capacity.taken * 100) / capacity.maxCapacity;
    }

    return (
        <div className={`flex flex-col gap-2 ${hasTopBorder && "border-t border-gray-400 pt-3"}`}>
            <p className="text-sm uppercase font-bold text-gray-500">Storage capacity</p>
            <div className="flex flex-col items-center bg-stone-50 p-3 rounded-md">
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row gap-1">
                        <p className="font-bold">{convertToUnit(takenStorage)}</p>
                        <p className="text-gray-400">{`${getUnit(takenStorage)}`}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <p className="font-bold">{convertToUnit(maxCapacity)}</p>
                        <p className="text-gray-400">{`${getUnit(maxCapacity)}`}</p>
                    </div>
                </div>
                <ProgressBar percentage={percentage} color={getBarColor(percentage)}/>
                {errText && <p className="text-xs text-center">{errText}</p>}
            </div>
        </div>
    )
};
