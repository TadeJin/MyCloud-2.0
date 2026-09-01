import Link from "next/link";
import { DarkSwitch } from "./DarkSwitch";
import { HyperText } from "./HyperText";
import { LogoIcon } from "./Icons";

export interface PolicySection {
    heading: string;
    body: string | string[];
}

interface PolicyDisplayProps {
    header: string;
    lastUpdated: string;
    sections: PolicySection[];
}

export const PolicyDisplay = ({ header, lastUpdated, sections }: PolicyDisplayProps) => {
    return (
        <div className="min-h-screen bg-stone-100 dark:bg-dark-page">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-10">
                <Link href="/" className="block w-32.5 h-11 sm:w-37.5 sm:h-12.5">
                    <LogoIcon className="w-full h-full dark:text-dark-text-primary" />
                </Link>
                <DarkSwitch />
            </div>

            <div className="flex justify-center px-4 pb-16 sm:px-6 md:px-10">
                <div className="w-full max-w-3xl flex flex-col gap-8 bg-white dark:bg-dark-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg dark:shadow-none">
                    <div className="flex flex-col gap-1 pb-6 border-b border-stone-100 dark:border-dark-border-subtle">
                        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-dark-text-primary tracking-tight">{header}</h1>
                        <p className="text-sm text-stone-400 dark:text-dark-text-idle">Last updated: {lastUpdated}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-stone-800 dark:text-dark-text-primary">Contact</h2>
                        <p className="text-sm md:text-base text-stone-600 dark:text-dark-text-secondary">
                            Questions about this page can be raised via{" "}
                            <HyperText href="https://github.com/TadeJin/MyCloud-2.0" target="_blank" color="text-stone-800 dark:text-dark-text-primary" className="font-semibold">
                                GitHub
                            </HyperText>.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {sections.map(({ heading, body }) => {
                            const paragraphs = Array.isArray(body) ? body : [body];

                            return (
                                <div key={heading} className="flex flex-col gap-2">
                                    <h2 className="text-lg font-semibold text-stone-800 dark:text-dark-text-primary">{heading}</h2>
                                    {paragraphs.map((paragraph, i) => (
                                        <p key={i} className="text-sm md:text-base text-stone-600 dark:text-dark-text-secondary">{paragraph}</p>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    <HyperText href="/" textSize="text-sm" color="text-stone-800 dark:text-dark-text-primary" className="font-semibold">
                        ← Back to home
                    </HyperText>
                </div>
            </div>
        </div>
    );
};
