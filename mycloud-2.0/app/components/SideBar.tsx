import { CapacityDisplay, CreateFolderButton, UploadButton } from "."


export const SideBar = () => {
    return (
        <div className="flex flex-col w-[18%] items-center mt-10 gap-3">
            <UploadButton />
            <CreateFolderButton />
            <div className="w-[90%] mt-auto mb-10">
                <CapacityDisplay />
            </div>
        </div>
    )
}
