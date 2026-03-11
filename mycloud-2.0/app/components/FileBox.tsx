"use client";
import Image from "next/image";
import file from "../../public/file.svg";

interface FileBoxProps {
    name: string
}

export const FileBox = ({name}: FileBoxProps) => {
    const handleClick = (e: React.MouseEvent<HTMLElement>) =>{
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
