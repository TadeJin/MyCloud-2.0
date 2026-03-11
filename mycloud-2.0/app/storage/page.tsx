import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LogOutButton } from "../components/LogOutButton";
import { FileDisplay } from "../components/FileDisplay";
import { UploadButton } from "../components/UploadButton";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QueryProvider } from "../components/QueryProvider";

export default async function StoragePage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <QueryProvider>
            <div className="flex flex-col">
                <div className="flex place-items-top w-screen items-center outline-2 outline-black p-2">
                    <div className="flex space-x-5 items-center ml-auto">
                        <p className="font-bold">Welcome {session.user?.email}</p>
                        <LogOutButton />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex space-x-3">
                        <h2 className="font-black text-4xl">Files:</h2>
                        <UploadButton />
                    </div>
                    <div className="flex space-x-5 w-screen">
                        <FileDisplay />
                    </div>
                </div>
            </div>
        </QueryProvider>
    )
};
