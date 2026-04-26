"use client";

import { useQuery } from "@tanstack/react-query";
import { ProgressBar } from ".";
import { useTRPC } from "../lib/trpc/client";

interface CapacityDisplayProps {
    hasTopBorder?: boolean
}

export const CapacityDisplay = (props: CapacityDisplayProps) => {
    const {hasTopBorder} = props;

    const GB_SIZE = 1024 * 1024 * 1024;
    const MB_SIZE = 1024 * 1024;

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

    const trpc = useTRPC();

    const { data: capacity, isLoading, error } = useQuery(trpc.users.fetchCapacity.queryOptions());
    let takenStorage = 0;
    let maxCapacity = 0;
    let percentage = 0;
    let errText = "";

    if (isLoading) {
        errText = "Loading available storage"; 
    } else if (error || !capacity) {
        errText = "Error occured while getting capacity";
    } else {
        takenStorage = capacity.taken;
        maxCapacity = capacity.maxCapacity;
        percentage = (capacity.taken * 100) / capacity.maxCapacity;
    }

    return (
        <div className={`flex flex-col gap-2 ${hasTopBorder && "border-t border-stone-300 dark:border-dark-border pt-3"}`}>
            <p className="uppercase font-bold text-stone-500 dark:text-dark-text-idle text-xs md:text-sm">Storage capacity</p>
            <div className="flex flex-col items-center bg-white dark:bg-dark-card p-3 rounded-md border border-stone-200 dark:border-dark-border">
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col items-center text-xs md:hidden w-full gap-0.5 mb-0.5">
                        <p className="text-gray-400 dark:text-dark-text-idle">Remaining</p>
                        <div className="flex gap-1">
                            <p className="dark:text-dark-text-primary">{convertToUnit(maxCapacity - takenStorage)}</p>
                            <p className="text-gray-400 dark:text-dark-text-idle">{getUnit(maxCapacity - takenStorage)}</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-row gap-1">
                        <p className="font-bold dark:text-dark-text-primary">{convertToUnit(takenStorage)}</p>
                        <p className="text-gray-400 dark:text-dark-text-idle">{`${getUnit(takenStorage)}`}</p>
                    </div>
                    <div className="hidden md:flex flex-row gap-1">
                        <p className="font-bold dark:text-dark-text-primary">{convertToUnit(maxCapacity)}</p>
                        <p className="text-gray-400 dark:text-dark-text-idle">{`${getUnit(maxCapacity)}`}</p>
                    </div>
                </div>
                <ProgressBar percentage={percentage} color={getBarColor(percentage)}/>
                {errText && <p className="text-xs text-center">{errText}</p>}
            </div>
        </div>
    )
};
