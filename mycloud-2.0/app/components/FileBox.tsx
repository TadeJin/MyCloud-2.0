"use client";
import Image from "next/image";
import file from "../../public/file.svg";
import { useQueryClient } from "react-query";
import { useRef, useState } from "react";

interface FileBoxProps {
    id: number,
    name: string,
    mimeType: string
}

export const FileBox = ({id, name, mimeType}: FileBoxProps) => {
    const queryClient = useQueryClient();
    const [isReadonly, setIsReadonly] = useState(true);
    const [inputValue, setInputValue] = useState(name)
    const nameRef = useRef<HTMLInputElement>(null);

    const handleDownload = async () => {
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

    const handleRename = async () => {
        await fetch ("/api/files/rename", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                oldName: name,
                newName: nameRef.current?.value
            }),
        });

        setIsReadonly(true);
        queryClient.invalidateQueries("files");
    }

    const prepRename = () => {
        if (!nameRef.current) return;

        setIsReadonly(false);
        setInputValue("");
        nameRef.current.focus();
    }

    return (
        <div className="flex space-x-1 outline-2 outline-black items-cente">
            <Image src={file} alt="fileIcon" width={20}  height={20}/>
            <input ref={nameRef} readOnly={isReadonly}  value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={handleDownload}>Download</button>
            <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={handleDelete}>Delete</button>
            {isReadonly ? <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={prepRename}>Rename</button> : <button className="outline-2 outline-black hover:bg-gray-600 cursor-pointer" onClick={handleRename}>Submit</button>}
        </div>
    )
}
