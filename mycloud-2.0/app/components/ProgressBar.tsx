interface ProgressBarProps {
    percentage: number
}

export const ProgressBar = (props: ProgressBarProps) => {
    const {percentage} = props;

    return (
        <div className="w-full bg-gray-400 rounded-full h-2">
            <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}