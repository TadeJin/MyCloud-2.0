import { redirect } from "next/navigation";
import { CapacityDisplay, CreateFolderButton, MultipleFileOperations, SortPicker, UploadButton } from "."
import Image from "next/image";


export const SideBar = () => {
    return (
        <div className="flex flex-col lg:w-[18%] w-[30%] h-screen items-center gap-3 relative bg-stone-100 border-r border-stone-200">
            <div className="w-17 h-17 relative block md:hidden">
                <Image 
                    src="./mycloud-logo-small.svg" 
                    alt="mycloud-logo" 
                    fill
                    onClick={() => redirect("/")} 
                    className="cursor-pointer"
                />
            </div>

            <div className="items-center h-[8%] md:h-[11%] w-full relative -mt-4 hidden md:flex">
                <Image
                    src="/logo.svg"
                    alt="MyCloud logo"
                    onClick={() => redirect("/")}
                    className="cursor-pointer"
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
