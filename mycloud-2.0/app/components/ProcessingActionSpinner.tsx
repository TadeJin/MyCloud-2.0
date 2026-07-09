import { ActionSpinnerContent } from ".";

interface ProcessingActionSpinnerProps {
    spinnerHeader: string
};

export const ProcessingActionSpinner = (props: ProcessingActionSpinnerProps) => {
    const {spinnerHeader} = props;

    return (
        <div className="flex items-center bg-white dark:bg-dark-card rounded-lg shadow-2xl border border-stone-200 dark:border-dark-border p-3 gap-2">
            <ActionSpinnerContent header={spinnerHeader} />
        </div>
    );
}