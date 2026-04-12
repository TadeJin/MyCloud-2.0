import { FilterOptions } from "../types";

export const DEFAULT_MAX_STORAGE = 1024 * 1024 * 1024; // 1GB
export const FILE_CHUNK_SIZE = 20 * 1024 * 1024; // 20MB
export const typeMap: Record<FilterOptions, string> = {
    All: "",
    Pictures: "image",
    Videos: "video",
    Documents: "application",
    Other: ""
};