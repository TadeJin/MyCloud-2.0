import { UserSortPreference } from "@/generated/prisma/enums";
import { DateTime } from "next-auth/providers/kakao";

export interface DisplayFile {
    id: number,
    name: string,
    userId: number,
    type: string,
    size: number,
uploadedAt: DateTime,
    isCorrupted: boolean
}

export interface DBFile {
    id: number,
    name: string,
    userId: number,
    type: string,
    size: bigint,
    uploadedAt: Date,
    folderId: number | null
}

export interface DBFolder {
    id: number,
    name: string,
    userId: number,
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