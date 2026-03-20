import { DateTime } from "next-auth/providers/kakao";

export interface DBFile {
    id: number,
    name: string,
    userId: number,
    type: string,
    size: number,
    uploadedAt: DateTime
}
export type FileVariants = "file" | "folder";

export interface ConfirmationDialogProps {
    headerText: string,
    hasInput: boolean,
    onSubmit: ((newName: string) => void) | (() => void),
}