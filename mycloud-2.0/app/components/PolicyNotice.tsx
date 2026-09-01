import { HyperText } from "./HyperText";

export const PolicyNotice = () => {
    return (
        <p className="text-xs text-stone-400 dark:text-dark-text-idle text-center">
            By continuing, you agree to our{" "}
            <HyperText href="/terms" target="_blank">Terms of Service</HyperText>{" "}
            and{" "}
            <HyperText href="/privacy" target="_blank">Privacy Policy</HyperText>.
        </p>
    );
};
