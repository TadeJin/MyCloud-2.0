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
        <div className={`flex bg-white p-2 gap-1 rounded-lg cursor-pointer items-center ${styles ? styles : "hover:bg-blue-200"} w-24 md:w-45 lg:w-fit`} onClick={(e) => onClick(e)}>
            <Image src={imgSrc} alt={`${text}-icon`} height={24} width={24} />
            <p className="text-xs md:text-base">{text}</p>
        </div>
    )
}