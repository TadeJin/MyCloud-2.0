import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FileDisplay } from "../components/FileDisplay";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QueryProvider } from "../components/QueryProvider";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";

export default async function StoragePage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <QueryProvider>
            <div className="flex flex-col">
                <NavBar session= {session} />
                <FileDisplay className="ml-[20%] mt-[2%]"/>
                <SideBar />
            </div>
        </QueryProvider>
    )
};
