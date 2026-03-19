import { useErrors } from ".";
import Image from "next/image";

export const ErrorDisplay = () => {
    const {errorMessage, setErrorMessage} = useErrors();

    if (!errorMessage) return null;

    return (
        <div className="fixed left-0 top-0 w-screen h-screen flex justify-center items-center bg-gray-200/60">
            <div className="flex flex-col justify-center items-center min-w-[20%] min-h-[10%] outline-red-400 outline-5 rounded-md bg-red-100 relative">
                <button className = "absolute right-1 top-1 cursor-pointer hover:bg-gray-400 rounded-full" onClick={() => setErrorMessage("")}><Image src="/x.svg" alt="close-error" height={24} width={24}/></button>
                <div className="absolute top-1 flex text-red-600 font-bold"><Image src="/alert-triangle.svg" width={24} height={24} alt="error-alert" />Error occurred</div>
                <p className="font-bold text-center">{errorMessage}</p>
            </div>
        </div>
    )
}
