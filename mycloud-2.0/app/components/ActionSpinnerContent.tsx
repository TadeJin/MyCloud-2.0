import { SpinnerIcon } from ".";

interface ActionSpinnerContentProps {
    header: string
}

export const ActionSpinnerContent = (props: ActionSpinnerContentProps) => {
    const {header} = props;

    return (
        <>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 dark:bg-dark-hover shrink-0">
                <SpinnerIcon />
            </div>
            <div>
                <p className="text-[10px] font-medium text-stone-400 dark:text-dark-text-idle uppercase tracking-widest leading-none mb-1">In progress</p>
                <p className="font-semibold text-stone-700 dark:text-dark-text-primary text-sm">{header}</p>
            </div>
        </>
    );
}
