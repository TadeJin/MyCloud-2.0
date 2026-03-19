import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QueryProvider, FolderProvider, ActiveFileProvider, StoragePageUI, ErrorProvider } from "../components";

export default async function StoragePage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <QueryProvider>
            <FolderProvider>
                <ActiveFileProvider>
                    <ErrorProvider>
                        <StoragePageUI session={session}/>
                    </ErrorProvider>
                </ActiveFileProvider>
            </FolderProvider>
        </QueryProvider>
    )
};
