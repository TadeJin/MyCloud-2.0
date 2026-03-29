import { Dispatch, SetStateAction } from "react"
import { SettingsContentVariants } from "../types"
import { SettingsMenuButton } from ".";

interface SettingsMenuProps {
    content: SettingsContentVariants,
    setContent: Dispatch<SetStateAction<SettingsContentVariants>>
}

export const SettingsMenu = (props: SettingsMenuProps) => {
    const {content, setContent} = props;

    return (
        <div className="flex-1 flex flex-col gap-1 w-[70%]">
            <SettingsMenuButton isSelected={content === "account"} imageSrc="./user.svg" onClick={() => setContent("account")} text="Account settings"/>
            <SettingsMenuButton isSelected={content === "storage"} imageSrc="./cloud.svg" onClick={() => setContent("storage")} text="Storage settings"/>
        </div>
    )
}