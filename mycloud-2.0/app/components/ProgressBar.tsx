interface ProgressBarProps {
    percentage: number,
    color: string
}

export const ProgressBar = (props: ProgressBarProps) => {
    const {percentage, color} = props;

    return (
        <div className="w-full bg-gray-400 rounded-full h-2">
            <div
                className={`${color} h-2 rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}