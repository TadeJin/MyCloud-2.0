import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QueryProvider, FolderProvider, NavBar, SideBar, FileDisplay } from "../components";

export default async function StoragePage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <QueryProvider>
            <FolderProvider>
                <div className="flex flex-col relative w-screen h-screen">
                    <NavBar session= {session} />
                    <div className="flex flex-row h-[calc(100vh-48px)] w-screen">
                        <SideBar />
                        <FileDisplay className="pl-10 pt-5"/>
                    </div>
                </div>
            </FolderProvider>
        </QueryProvider>
    )
};
