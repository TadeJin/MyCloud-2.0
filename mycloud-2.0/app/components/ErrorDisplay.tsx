import { useErrors } from ".";
import Image from "next/image";

export const ErrorDisplay = () => {
    const {errorMessage, setErrorMessage} = useErrors();

    if (!errorMessage) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/20 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center min-w-[20%] min-h-[10%] border-2 border-red-300 shadow-lg rounded-md bg-red-100 relative p-8">
                <button className = "absolute right-1 top-1 cursor-pointer hover:bg-red-200 rounded-full" onClick={() => setErrorMessage("")}><Image src="/x.svg" alt="close-error" height={24} width={24}/></button>
                <div className="absolute top-1 flex text-red-600 font-bold"><Image src="/alert-triangle.svg" width={24} height={24} alt="error-alert" />Error occurred</div>
                <p className="font-bold text-center">{errorMessage}</p>
            </div>
        </div>
    )
}
