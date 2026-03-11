"use client";

import { useQuery } from "react-query";
import { FileBox } from "./FileBox";

interface DBFile {
    id: number,
    name: string,
    userId: number,
    type: string,
    size: number
}

export const FileDisplay = () => {
    const fetchFiles = async () => {
        const res = await fetch("/api/files/fetchFiles")
        return res.json();
    }

    const {data, status} = useQuery("files", fetchFiles);

    if (status === "loading") return <p>Loading files...</p>;

    if (status === "error") return <p>Error loading files</p>;

    return (
        <>
        {data.map((file: DBFile) => (
            <FileBox key = {file.name} id={file.id} name={file.name} mimeType={file.type}/>
        ))}
        </>
    )
}