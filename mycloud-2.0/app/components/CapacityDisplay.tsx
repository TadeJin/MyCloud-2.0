import { ProgressBar } from ".";

export const CapacityDisplay = () => {
    const used = "500 MB";
    const total = "1 GB";

    return (
        <div className="flex flex-col items-center">
            <p className="font-bold">Storage capacity</p>
            <ProgressBar percentage={50}/>
            <p className="text-xs">You have used {used} from {total} capacity</p>
        </div>
    )
};
