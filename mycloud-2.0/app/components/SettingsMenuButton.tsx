import Image from "next/image";

interface SettingsMenuButtonProps {
    imageSrc: string,
    text: string,
    onClick: () => void,
    isSelected: boolean
}

export const SettingsMenuButton = (props: SettingsMenuButtonProps) => {
    const {imageSrc, onClick, text, isSelected} = props

    return (
        <div className={`flex items-center gap-1 justify-center cursor-pointer p-3 transition-colors rounded-lg w-full ${isSelected ? "bg-gray-300" : "hover:bg-gray-200"}`} onClick={onClick}>
            <Image src={imageSrc} alt={`${text}-icon`} width={20} height={20}/>
            <p>{text}</p>
        </div>
    )
}
