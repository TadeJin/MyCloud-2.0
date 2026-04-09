import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { SettingsPageUI } from "../components";

export default async function SettingsPage() {
    const session = await auth.api.getSession({headers: await headers()})

    if (!session) {
        redirect("/");
    }
    
    return <SettingsPageUI />
}