"use client";
import Image from "next/image";
import file from "../../public/file.svg";

interface FileBoxProps {
    name: string,
    mimeType: string
}

export const FileBox = ({name, mimeType}: FileBoxProps) => {
    const handleClick = async (e: React.MouseEvent<HTMLElement>) =>{
        const res = await fetch(`/api/files/download?name=${name}&type=${mimeType}`);
        const blob = await res.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();

        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex space-x-1 outline-2 outline-black items-center hover:bg-gray-600 cursor-pointer" onClick={handleClick}>
            <Image src={file} alt="fileIcon" width={20}  height={20}/>
            <div>{name}</div>
        </div>
    )
}
