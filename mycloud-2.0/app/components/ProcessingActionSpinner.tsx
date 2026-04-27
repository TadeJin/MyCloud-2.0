import { SpinnerIcon } from ".";

interface ProcessingActionSpinnerProps {
    spinnerHeader: string
};

export const ProcessingActionSpinner = (props: ProcessingActionSpinnerProps) => {
    const {spinnerHeader} = props;

    return (
        <div className="flex items-center bg-white dark:bg-dark-card rounded-lg shadow-2xl border border-stone-200 dark:border-dark-border p-3 gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 dark:bg-dark-hover shrink-0">
                <SpinnerIcon /> 
            </div>
            <div>
                <p className="text-[10px] font-medium text-stone-400 dark:text-dark-text-idle uppercase tracking-widest leading-none mb-0.5">In progress</p>
                <p className="font-semibold text-stone-700 dark:text-dark-text-primary text-sm">{spinnerHeader}</p>
            </div>
        </div>
    );
}