import { Dispatch, SetStateAction } from "react"
import { SettingsContentVariants } from "../types"
import { CloudIcon, UserIcon } from ".";
import { SettingsMenuButton } from ".";

interface SettingsMenuProps {
    content: SettingsContentVariants,
    setContent: Dispatch<SetStateAction<SettingsContentVariants>>
}

export const SettingsMenu = (props: SettingsMenuProps) => {
    const {content, setContent} = props;

    return (
        <div className="flex-1 flex flex-col gap-1 w-[80%] md:w-[70%]">
            <SettingsMenuButton isSelected={content === "account"} icon={<UserIcon size={20} />} onClick={() => setContent("account")} text="Account settings"/>
            <SettingsMenuButton isSelected={content === "storage"} icon={<CloudIcon size={20} />} onClick={() => setContent("storage")} text="Storage settings"/>
        </div>
    )
}