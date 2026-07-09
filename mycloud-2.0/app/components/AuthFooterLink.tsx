import Link from "next/link";

interface AuthFooterLinkItem {
    text: string;
    href: string;
    label: string;
}

interface AuthFooterLinkProps {
    links: AuthFooterLinkItem[];
}

export const AuthFooterLink = ({ links }: AuthFooterLinkProps) => {
    return (
        <div className="flex flex-col gap-1 text-sm text-stone-500 dark:text-dark-text-idle text-center">
            {links.map(({ text, href, label }) => (
                <p key={href}>
                    {text}{" "}
                    <Link href={href} className="text-stone-800 dark:text-dark-text-primary font-semibold underline underline-offset-2 hover:text-stone-600 dark:hover:text-dark-text-secondary transition">
                        {label}
                    </Link>
                </p>
            ))}
        </div>
    );
};
