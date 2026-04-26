import { Suspense } from "react";
import { ResetForm } from "../components";

export default function ResetPage() {
    return (
        <Suspense>
            <ResetForm variant="email"/>
        </Suspense>
    );
}