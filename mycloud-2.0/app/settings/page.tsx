import { getServerSession } from "next-auth";
import { SettingsPageUI } from "../components";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }
    
    return <SettingsPageUI />
}