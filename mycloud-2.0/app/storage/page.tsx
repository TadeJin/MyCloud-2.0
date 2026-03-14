import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FileDisplay } from "../components/FileDisplay";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QueryProvider } from "../components/QueryProvider";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";
import { FolderProvider } from "../components/FolderProvider";
import { FolderTrace } from "../components/FolderTrace";

export default async function StoragePage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <QueryProvider>
            <FolderProvider>
                <div className="flex flex-col">
                    <NavBar session= {session} />
                    <FolderTrace />
                    <FileDisplay className="ml-[20%] mt-[2%]"/>
                    <SideBar />
                </div>
            </FolderProvider>
        </QueryProvider>
    )
};
