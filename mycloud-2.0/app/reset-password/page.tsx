import { Suspense } from "react";
import { ResetPasswordContent } from "../components";

export default function ResetPageExe() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordContent />
        </Suspense>
    );
}