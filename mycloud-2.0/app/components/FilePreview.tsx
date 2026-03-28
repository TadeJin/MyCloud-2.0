"use client";

import { useFiles } from "./ActiveFileProvider";
import { useEffect, useState } from "react";
import Image from "next/image";

export const FilePreview = () => {
    const {activeFile, previewVisible, setPreviewVisible} = useFiles()
    const [srcUrl, setSrcUrl] = useState("");
    const {name, mimeType, id} = activeFile;
    const [svgContent, setSvgContent] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!previewVisible) return;

        let url: string

        const load = async () => {
            setLoading(true);
            const res = await fetch(`/api/files/download?name=${name}&type=${mimeType}&id=${id}`);
            setLoading(false);

            if (mimeType === "image/svg+xml") {
                setSvgContent(await res.text());
                return;
            }

            const blob = await res.blob();
            url = URL.createObjectURL(blob);
            setSrcUrl(url);
        }

        load();

        return () => {
            if (url) URL.revokeObjectURL(url);
        }
    }, [previewVisible, id, name, mimeType]);

    const renderPreview = () => {
        if (loading) {
            return <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-600 border-t-transparent" />;
        }

        if (mimeType === "image/svg+xml") {
            return <div dangerouslySetInnerHTML={{ __html: svgContent }} />
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
        setSvgContent("");
        setPreviewVisible(false);
    }

    return (
        <>
        {previewVisible && (srcUrl || svgContent) &&
        <div className="absolute w-screen h-screen flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center border border-stone-600 bg-white w-[90%] h-[90%] rounded-lg p-5 relative gap-2">
                <div className="flex w-full justify-center">
                    <h2 className="text-sm font-medium text-stone-600 truncate max-w-[70%]">{name}</h2>
                    <div className=" absolute right-5 p-1 rounded-full hover:bg-gray-200 cursor-pointer" onClick={exitPreview}><Image src="./x.svg" alt="close-preview-icon" width={24} height={24} /></div>
                </div>
                <div className="flex-1 flex justify-center items-center relative overflow-hidden w-full">
                {renderPreview()}
                </div>
            </div>
        </div>}
        </>
    );
}
