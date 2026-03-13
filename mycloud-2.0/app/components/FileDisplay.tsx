"use client";

import { useQuery } from "react-query";
import { FileBox } from "./FileBox";
import { DBFile } from "../types";

interface FileDisplayProps {
    className?: string
}

export const FileDisplay = (props: FileDisplayProps) => {
    const {className} = props;

    const fetchFiles = async () => {
        const res = await fetch("/api/files/fetchFiles")
        return res.json();
    }

    const {data, status} = useQuery("files", fetchFiles);

    if (status === "loading") return <p>Loading files...</p>;

    if (status === "error") return <p>Error loading files</p>;

    const style = "flex flex-col " + className

    return (
        <div className={style}>
            <h2 className="font-black text-4xl">Files:</h2>
            {data.map((file: DBFile) => (
                <FileBox key = {file.name} id={file.id} name={file.name} mimeType={file.type}/>
            ))}
        </div>
    )
}
