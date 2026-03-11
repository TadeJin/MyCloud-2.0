"use client";
import Image from "next/image";
import file from "../../public/file.svg";
import { useQueryClient } from "react-query";

interface FileBoxProps {
    id: number,
    name: string,
    mimeType: string
}

export const FileBox = ({id, name, mimeType}: FileBoxProps) => {
    const queryClient = useQueryClient();

    const handleClick = async () => {
        const res = await fetch(`/api/files/download?name=${name}&type=${mimeType}`);
        const blob = await res.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();

        URL.revokeObjectURL(url);
    }

    const handleDelete = async () => {
        await fetch ("/api/files/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id
            }),
        });

        queryClient.invalidateQueries("files");
    }

    return (
        <div className="flex space-x-1 outline-2 outline-black items-cente">
            <Image src={file} alt="fileIcon" width={20}  height={20}/>
            <div onClick={handleClick} className="hover:bg-gray-600 cursor-pointer">{name}</div>
            <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={handleDelete}>Delete</button>
        </div>
    )
}
