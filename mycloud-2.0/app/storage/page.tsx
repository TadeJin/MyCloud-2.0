import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LogOutButton } from "../components/UserDisplay";

export default async function StoragePage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col items-center outline-2 outline-black p-2">
                <p>Welcome {session.user?.email}</p>
                <LogOutButton />
            </div>
        </div>
    )
};
