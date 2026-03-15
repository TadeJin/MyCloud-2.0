import { DateTime } from "next-auth/providers/kakao";

export interface DBFile {
    id: number,
    name: string,
    userId: number,
    type: string,
    size: number,
    uploadedAt: DateTime
}
export type FileNameInputVariants = "file" | "folder";
