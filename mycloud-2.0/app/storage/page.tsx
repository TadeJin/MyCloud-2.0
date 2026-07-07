import { redirect } from "next/navigation";
import { FolderProvider, ActiveFileProvider, StoragePageUI, ErrorProvider, UploadProvider } from "../components";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export default async function StoragePage() {
    const session = await auth.api.getSession({headers: await headers()})

    if (!session) redirect("/");

    return (
            <FolderProvider>
                <ActiveFileProvider>
                    <ErrorProvider>
                        <UploadProvider>
                            <StoragePageUI />
                        </UploadProvider>
                    </ErrorProvider>
                </ActiveFileProvider>
            </FolderProvider>
    )
};
