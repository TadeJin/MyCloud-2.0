"use client";

import { redirect, useSearchParams } from "next/navigation";
import { ResetForm } from "../components";

export default function ResetPageExe() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    if (!token) redirect("/");

    return <ResetForm variant="password" token={token}/>
}
