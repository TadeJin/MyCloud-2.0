import { HyperText } from "./HyperText";

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
                    <HyperText href={href} color="text-stone-800 dark:text-dark-text-primary" className="font-semibold">
                        {label}
                    </HyperText>
                </p>
            ))}
        </div>
    );
};
