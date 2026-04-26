import { Suspense } from "react";
import { ResetForm } from "../components";

export default function ResetPageExe() {
    return (
        <Suspense>
            <ResetForm variant="password"/>
        </Suspense>
    );
}