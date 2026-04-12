import { UserSortPreference } from "@/generated/prisma/enums";
import z from "zod";
import { filterOptions } from "../lib/validators";

export interface DisplayFile {
    id: number,
    name: string,
    userId: string,
    type: string,
    size: number,
    uploadedAt: Date,
    isCorrupted: boolean
}

export interface DBFile {
    id: number,
    name: string,
    userId: string,
    type: string,
    size: bigint,
    uploadedAt: Date,
    folderId: number | null
}

export interface DBFolder {
    id: number,
    name: string,
    userId: string,
    createdAt: Date,
    folderId: number | null
}

export type FileVariants = "file" | "folder";

export interface ConfirmationDialogProps {
    headerText: string,
    hasInput: boolean,
    onSubmit: ((newName: string) => void) | (() => void),
}

export type SortPreference = `${UserSortPreference}`;

export type SettingsContentVariants = "account" | "storage";
export type FilterOptions = z.infer<typeof filterOptions>;