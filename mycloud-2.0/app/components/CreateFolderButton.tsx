"use client";

import { useState } from "react";
import { FileNameInput } from "./FileNameInput";

export const CreateFolderButton = () => {
    const [visible, setVisible] = useState(false);

    const handleClick = () => {
        setVisible(true);
    }

    return (
        <div className="flex flex-col">
            <button className = "p-1 outline-1 outline-black hover:bg-gray-400 cursor-pointer" onClick={handleClick}>Create folder</button>
            {visible && <FileNameInput variant="folder" setVisible={setVisible} id={null}/>}
        </div>
    )
};
