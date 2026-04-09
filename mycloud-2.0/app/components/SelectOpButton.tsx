import Image from "next/image";

interface SelectOpButtonProps {
    text: string,
    imgSrc: string,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
    styles?: string
}

export const SelectOpButton = (props: SelectOpButtonProps) => {
    const {imgSrc, text, onClick, styles} = props;

    return (
        <div className={`flex bg-stone-50 border border-stone-200 p-2 gap-1 rounded-md cursor-pointer items-center shadow-sm hover:shadow-md transition-all duration-200 ${styles ? styles : "hover:bg-stone-200"} w-24 md:w-45 lg:w-fit`} onClick={(e) => onClick(e)}>
            <Image src={imgSrc} alt={`${text}-icon`} height={24} width={24} />
            <p className="text-xs md:text-base">{text}</p>
        </div>
    )
}