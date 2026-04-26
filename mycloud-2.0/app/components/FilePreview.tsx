"use client";

import { useFiles } from "./ActiveFileProvider";
import { useEffect, useState } from "react";
import { XIcon } from ".";

export const FilePreview = () => {
    const {activeFile, previewVisible, setPreviewVisible} = useFiles()
    const [srcUrl, setSrcUrl] = useState("");
    const {name, mimeType, id} = activeFile;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!previewVisible) return;

        let url: string

        const load = async () => {
            setLoading(true);
            const res = await fetch(`/api/downloads/download?id=${id}`);
            if (res.ok) {
                setError(false);
                setLoading(false);
            } else {
                setError(true);
                return
            }

            const blob = await res.blob();
            url = URL.createObjectURL(blob);
            setSrcUrl(url);
        }

        load();

        return () => {
            if (url) URL.revokeObjectURL(url);
        }
    }, [id, mimeType, previewVisible]);

    const renderPreview = () => {
        if (error) {
            return <div className="text-red-500 font-bold">Error previewing file</div>;
        }

        if (loading || (!srcUrl)) {
            return (
                <div className="flex flex-col w-full items-center justify-center py-14 gap-4" style={{ animation: "spinnerDelay 0s 300ms both" }}>
                <svg
                    className="animate-spin w-8 h-8 text-stone-400"
                    style={{ animationDuration: "0.6s" }}
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" className="text-stone-200"/>
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400">Loading preview</p>
            </div>
            )
        }

        if (mimeType === "application/pdf") {
            return <iframe src={srcUrl} className="w-full h-full" />;
        }

        if (mimeType && mimeType.startsWith("image/")) {
            return <img src={srcUrl} className="max-w-full max-h-full object-contain" />
        }

        if (mimeType && mimeType.startsWith("video/")) {
            return <video controls src={srcUrl} className="max-w-full max-h-full"></video>
        }
        
        return <div></div>
    }

    const exitPreview = () => {
        setSrcUrl("");
        setPreviewVisible(false);
    }

    return (
        <>
        {previewVisible &&
        <div className="absolute w-screen h-screen flex items-center justify-center backdrop-blur-sm z-20">
            <div className="flex flex-col items-center border border-stone-600 dark:border-dark-border-strong bg-white dark:bg-dark-card w-[90%] h-[90%] rounded-lg p-5 relative gap-2">
                <div className="flex w-full justify-center">
                    <h2 className="text-sm font-medium text-stone-600 dark:text-dark-text-secondary truncate max-w-[70%]">{name}</h2>
                    <div className="absolute right-5 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-hover cursor-pointer dark:text-dark-text-primary" onClick={exitPreview}><XIcon /></div>
                </div>
                <div className="flex-1 flex justify-center items-center relative overflow-hidden w-full">
                {renderPreview()}
                </div>
            </div>
        </div>}
        </>
    );
}
