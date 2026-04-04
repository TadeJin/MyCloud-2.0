import { CapacityDisplay, CreateFolderButton, MultipleFileOperations, SortPicker, UploadButton } from "."
import Image from "next/image";


export const SideBar = () => {
    return (
        <div className="flex flex-col lg:min-w-[18%] min-w-[30%] h-screen items-center gap-3 relative">
            <div className="flex items-center h-[8%] md:h-[10%] w-full relative -mt-4">
                <Image
                    src="/logo.svg"
                    alt="MyCloud logo"
                    fill
                />
            </div>
            <UploadButton />
            <CreateFolderButton />
            <SortPicker />
            <div className="block md:hidden">
                <MultipleFileOperations column/>
            </div>
            <div className="w-[90%] mt-auto mb-10">
                <CapacityDisplay hasTopBorder/>
            </div>
        </div>
    )
}
