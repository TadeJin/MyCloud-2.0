import { redirect } from "next/navigation";
import { RegisterForm } from "../components";
import { headers } from "next/headers";
import { auth } from "../lib/auth";

export default async function RegisterPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (session) redirect("/");
    
    return <RegisterForm />
};
