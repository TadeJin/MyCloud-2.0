import { CapacityDisplay, CreateFolderButton, SortPicker, UploadButton } from "."
import Image from "next/image";


export const SideBar = () => {
    return (
        <div className="flex flex-col w-[18%] items-center gap-3">
            <div className="flex items-center h-[10%] w-70 relative -mt-4">
                <Image
                    src="/logo.svg"
                    alt="MyCloud logo"
                    fill
                />
            </div>
            <UploadButton />
            <CreateFolderButton />
            <SortPicker />
            <div className="w-[90%] mt-auto mb-10">
                <CapacityDisplay />
            </div>
        </div>
    )
}
