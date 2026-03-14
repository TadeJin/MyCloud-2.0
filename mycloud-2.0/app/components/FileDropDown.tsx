import { Dispatch, SetStateAction } from "react"

interface FileDropDownProps {
    handleDownload: () => void,
    handleDelete: () => void,
    setVisible: Dispatch<SetStateAction<boolean>>
    setDropDownVisible: Dispatch<SetStateAction<boolean>>
}

export const FileDropDown = (props: FileDropDownProps) => {
    const {handleDownload, handleDelete, setVisible, setDropDownVisible} = props;

    return (
        <div className="flex flex-col absolute top-8 left-[90%] bg-white outline-2 outline-black rounded-md w-30 z-10">
            <button className="hover:bg-gray-600 cursor-pointer" onClick={handleDownload}>Download</button>
            <button className="hover:bg-gray-600 cursor-pointer" onClick={handleDelete}>Delete</button>
            <button className="hover:bg-gray-600 cursor-pointer" onClick={() => {setDropDownVisible(false); setVisible(true)}}>Rename</button> 
        </div>
    )
}