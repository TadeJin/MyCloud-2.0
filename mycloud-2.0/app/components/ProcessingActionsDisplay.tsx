import { ProcessingActionSpinner } from "./ProcessingActionSpinner";
import { useSpinners } from "./SpinnerProvider"

export const ProcessingActionsDisplay = () => {
    const {inBackgroundActions} = useSpinners();

    if (inBackgroundActions.length > 0) {
        return (
            <div className="fixed flex flex-col-reverse items-center right-6 bottom-5 gap-2">
                {inBackgroundActions.map(action => (
                    <ProcessingActionSpinner key={action.id} spinnerHeader={action.header} />
                ))}
            </div>
        );
    }

    return null;
}