import { redirect } from "next/navigation";
import { CapacityDisplay, CreateFolderButton, MultipleFileOperations, SortPicker, UploadButton } from "."
import { LogoIcon } from ".";


export const SideBar = () => {
    return (
        <div className="flex flex-col lg:w-[18%] w-[30%] h-screen items-center gap-3 relative bg-stone-100 dark:bg-dark-base border-r-2 border-stone-200 dark:border-dark-border z-10">
            {/* Viewport => md */}
            <div className="relative w-full -mt-1 md:w-[85%] h-14 md:mt-1" onClick={() => redirect("/")}>
                <LogoIcon className="cursor-pointer object-contain w-full h-full dark:text-dark-text-primary" />
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
