import Link from "next/link";

interface HyperTextProps {
    href: string;
    children: React.ReactNode;
    target?: string;
    textSize?: string;
    color?: string;
    hoverColor?: string;
    className?: string;
}

export const HyperText = ({
    href,
    children,
    target,
    textSize,
    color,
    hoverColor = "hover:text-stone-600 dark:hover:text-dark-text-secondary",
    className,
}: HyperTextProps) => {
    return (
        <Link
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className={`underline underline-offset-2 transition ${textSize ?? ""} ${color ?? ""} ${hoverColor} ${className ?? ""}`}
        >
            {children}
        </Link>
    );
};
