"use client";

import { useQuery } from "react-query";
import { FileBox } from "./FileBox";
import { DBFile } from "../types";
import { useFolders } from "./FolderProvider";

interface FileDisplayProps {
    className?: string
}

interface DBFolder {
    id: number,
    name: string,
    userId: number
}

export const FileDisplay = (props: FileDisplayProps) => {
    const {getOpenedFolderID} = useFolders();
    const {className} = props;

    const fetchFiles = async (folderId: number | null) => {
        const res = await fetch(`/api/files/fetchFiles?folderId=${folderId}`);
        return res.json();
    }

    const fetchFolders = async (folderId: number | null) => {
        const res = await fetch(`/api/files/fetchFolders?folderId=${folderId}`);
        return res.json();
    }

    const currentId = getOpenedFolderID();

    const { data: files, status: statusFiles } = useQuery(["files", currentId], () => fetchFiles(currentId));
    const { data: folders, status: statusFolders } = useQuery(["folders", currentId], () => fetchFolders(currentId));

    const style = "flex flex-col " + className

    return (
        <div className={style}>
            {statusFolders !== "loading" && statusFolders !== "error" && folders.length == 0 ? <></> :
                <>
                <h2 className="font-black text-4xl">Folders:</h2>
                {statusFolders === "loading" ? <p>Loading files...</p> : statusFolders === "error" ?<p>Error loading files</p> :

                folders.map((folder: DBFolder) => (
                    <FileBox key = {folder.id} id={folder.id} name={folder.name} userId={folder.userId} variant="folder"/>
                ))}
                </>
            }

            <h2 className="font-black text-4xl">Files:</h2>
            {statusFiles !== "loading" && statusFiles !== "error" && files.length == 0 ? <p>No files uploaded</p> :
                <div>
                {statusFiles === "loading" ? <p>Loading files...</p> : statusFiles === "error" ?<p>Error loading files</p> :

                files.map((file: DBFile) => (
                    <FileBox key = {file.id} id={file.id} name={file.name} userId={file.userId} variant="file"/>
                ))}
                </div>
            }
        </div>
    )
};
