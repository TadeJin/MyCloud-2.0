import { CreateFolderButton, UploadButton } from "."


export const SideBar = () => {
    return (
        <div className="flex flex-col w-[18%] items-center">
            <UploadButton />
            <CreateFolderButton />
        </div>
    )
}
