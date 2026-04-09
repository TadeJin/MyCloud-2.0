import { redirect } from "next/navigation";
import { CapacityDisplay, CreateFolderButton, MultipleFileOperations, SortPicker, UploadButton } from "."
import Image from "next/image";


export const SideBar = () => {
    return (
        <div className="flex flex-col lg:w-[18%] w-[30%] h-screen items-center gap-3 relative bg-stone-100 border-r-2 border-stone-200 z-0">
            {/* Mobile */}
            <div className="w-17 h-17 relative block md:hidden">
                <Image 
                    src="./mycloud-logo-small.svg" 
                    alt="mycloud-logo" 
                    fill
                    onClick={() => redirect("/")} 
                    className="cursor-pointer"
                />
            </div>

            {/* Viewport => md */}
            <div className="relative w-[85%] h-14 hidden md:block mt-1">
                <Image
                    src="/logo.svg"
                    alt="MyCloud logo"
                    onClick={() => redirect("/")}
                    className="cursor-pointer object-contain"
                    fill
                />
            </div>
            <UploadButton />
            <CreateFolderButton />
            <SortPicker />
            <div className="block xl:hidden mt-2">
                <MultipleFileOperations column/>
            </div>
            <div className="w-[90%] mt-auto mb-10">
                <CapacityDisplay hasTopBorder/>
            </div>
        </div>
    )
}
