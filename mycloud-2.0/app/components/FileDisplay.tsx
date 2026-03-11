"use client";

import { useQuery } from "react-query";
import { FileBox } from "./FileBox";

export const FileDisplay = () => {
    const fetchFiles = async () => {
        const res = await fetch("/api/fetchFiles")
        return res.json();
    }

    const {data, status} = useQuery("files", fetchFiles);

    if (status === "loading") return <p>Loading files...</p>;

    if (status === "error") return <p>Error loading files</p>;

    return (
        <>
        {data.map((file: File) => (
            <FileBox key = {file.name} name={file.name} />
        ))}
        </>
    )
}