import { DarkSwitch } from "./DarkSwitch";
import { LogoIcon } from "./Icons";
import { PolicyNotice } from "./PolicyNotice";

interface InputFormProps {
    header: string;
    subheader: string;
    children: React.ReactNode;
    showLogo?: boolean;
    onLogoClick?: () => void;
    hidePolicy?: boolean;
}

export const InputForm = ({ header, subheader, children, showLogo = true, onLogoClick, hidePolicy }: InputFormProps) => {
    return (
        <div className="grid place-items-center h-screen bg-stone-100 dark:bg-dark-page relative">
            <div className="absolute top-4 right-4"><DarkSwitch /></div>
            <div className="flex flex-col gap-6 bg-white dark:bg-dark-card p-10 pt-3 rounded-2xl shadow-lg dark:shadow-none w-full max-w-sm">

                <div className="flex flex-col gap-5">
                    {showLogo && (
                        <div className={`flex justify-center ${onLogoClick ? "cursor-pointer" : ""}`} onClick={onLogoClick}>
                            <LogoIcon className="w-[180px] h-[60px] dark:text-dark-text-primary" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 dark:text-dark-text-primary tracking-tight">{header}</h1>
                        <p className="text-sm text-stone-400 dark:text-dark-text-idle">{subheader}</p>
                    </div>
                </div>

                {children}

                {!hidePolicy && <PolicyNotice />}

            </div>
        </div>
    );
};
