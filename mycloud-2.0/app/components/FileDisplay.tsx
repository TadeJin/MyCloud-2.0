"use client";
import Image from "next/image";
import file from "../../public/file.svg";

interface FileDisplayProps {
    name: string
}

export const FileDisplay = ({name}: FileDisplayProps) => {
    const handleClick = (e: Event) =>{
        e.preventDefault();
        console.log("CLick");
    }

    return (
        <div className="flex space-x-1 outline-2 outline-black items-center hover:bg-gray-600 cursor-pointer" onClick={handleClick}>
            <Image src={file} alt="fileIcon" width={20}  height={20}/>
            <div>{name}</div>
        </div>
    )
}
