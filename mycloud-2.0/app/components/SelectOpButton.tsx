interface SelectOpButtonProps {
    text: string,
    icon: React.ReactNode,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
    styles?: string
}

export const SelectOpButton = (props: SelectOpButtonProps) => {
    const {icon, text, onClick, styles} = props;

    return (
        <div className={`flex bg-stone-50 dark:bg-dark-card dark:hover:bg-dark-hover border border-stone-200 dark:border-dark-border p-2 gap-1 rounded-md cursor-pointer items-center shadow-sm hover:shadow-md transition-all duration-100 ${styles}`} onClick={(e) => onClick(e)}>
            {icon}
            <p className="text-xs md:text-base dark:text-dark-text-primary">{text}</p>
        </div>
    )
}