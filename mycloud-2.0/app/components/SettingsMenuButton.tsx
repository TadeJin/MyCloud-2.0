interface SettingsMenuButtonProps {
    icon: React.ReactNode,
    text: string,
    onClick: () => void,
    isSelected: boolean
}

export const SettingsMenuButton = (props: SettingsMenuButtonProps) => {
    const {icon, onClick, text, isSelected} = props

    return (
        <div className={`flex items-center gap-1 justify-center md:justify-start cursor-pointer p-3 transition-colors rounded-lg w-full ${isSelected ? "bg-stone-800 dark:bg-dark-pill text-white" : "hover:bg-stone-200 dark:hover:bg-dark-hover dark:text-dark-text-primary"}`} onClick={onClick}>
            {icon}
            <p className="hidden md:block">{text}</p>
        </div>
    )
}
