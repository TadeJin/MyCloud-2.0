import { useErrors } from ".";
import { AlertTriangleIcon } from ".";

export const ErrorDisplay = () => {
    const {errorMessage, setErrorMessage} = useErrors();

    if (!errorMessage) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4 z-40">
            <div className="flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-stone-200 dark:border-dark-border w-full max-w-sm overflow-hidden">
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-200 border-b border-red-100 px-5 py-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-100 dark:bg-red-200 shrink-0">
                        <AlertTriangleIcon size={18} />
                    </div>
                    <p className="font-semibold text-red-700 text-sm tracking-wide uppercase">Error occurred</p>
                    <button
                        className="ml-auto cursor-pointer hover:bg-red-100 rounded-full p-1 transition-colors duration-150"
                        onClick={() => setErrorMessage("")}
                    >

                    </button>
                </div>
                <div className="px-6 py-5">
                    <p className="text-stone-700 dark:text-dark-text-secondary text-sm text-center leading-relaxed">{errorMessage}</p>
                </div>
                <div className="px-6 pb-5">
                    <button
                        className="w-full py-2.5 bg-stone-800 text-white text-sm font-semibold rounded-lg hover:bg-stone-700 transition-colors duration-150 cursor-pointer"
                        onClick={() => setErrorMessage("")}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    )
}
