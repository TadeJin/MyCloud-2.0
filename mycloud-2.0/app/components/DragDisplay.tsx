import { Dispatch, RefObject, SetStateAction } from "react";
import { DownloadIcon, XIcon } from "./Icons";
import { useErrors, useUpload } from ".";

interface DragDisplayProps {
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const DragDisplay = ({ setIsDragging, fileInputRef }: DragDisplayProps) => {
    const {setErrorMessage} = useErrors();
    const {isUploading} = useUpload();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (isUploading) return;

        if (fileInputRef.current) {
            fileInputRef.current.files = e.dataTransfer.files;
            fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
            setErrorMessage("Error dropping files");
        }
    };

    return (
        <div
            className="absolute w-full h-full z-50 flex items-center justify-center backdrop-blur-md"
            style={{ animation: "dropOverlayIn 0.2s ease-out both" }}
            onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsDragging(false);
                }
            }}
            onDrop={handleDrop}
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = isUploading ? "none" : "copy";
            }}
        >
            <div
                className="relative flex w-full max-w-sm md:max-w-md flex-col items-center gap-1 mx-6 rounded-4xl border-2 border-dashed border-stone-400 dark:border-dark-border-strong bg-white/90 dark:bg-dark-card/90 px-10 py-12 md:px-16 md:py-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]"
                style={{ animation: "dropCardIn 0.4s 0.04s cubic-bezier(0.16,1,0.3,1) both" }}
            >
                <div
                    className={`mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full ${
                        isUploading
                            ? "bg-red-100 text-red-500 dark:bg-red-300/20 dark:text-red-300"
                            : "bg-stone-100 text-stone-700 dark:bg-dark-hover dark:text-dark-text-primary"
                    }`}
                    style={{ animation: isUploading ? "dropShake 0.5s ease-in-out both" : "dropIconFloat 1.8s ease-in-out infinite" }}
                >
                    {isUploading ? <XIcon size={28} /> : <DownloadIcon size={28} />}
                </div>

                <p
                    className="text-2xl md:text-3xl font-black tracking-tight text-stone-800 dark:text-dark-text-primary"
                    style={{ animation: "dropItemIn 0.45s 0.08s cubic-bezier(0.16,1,0.3,1) both" }}
                >
                    {isUploading ? "Hang tight" : "Drop it here"}
                </p>
                <p
                    className="mt-1 text-sm text-stone-500 dark:text-dark-text-idle text-center"
                    style={{ animation: "dropItemIn 0.45s 0.14s cubic-bezier(0.16,1,0.3,1) both" }}
                >
                    {isUploading ? "Wait for the current upload to finish" : "Release to add it to this folder"}
                </p>
            </div>
        </div>
    );
};
