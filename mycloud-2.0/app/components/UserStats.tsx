import { Session } from "next-auth";
import { LogOutButton } from ".";
import { Dispatch, Ref, SetStateAction} from "react";
import Image from "next/image";

interface UserStatsProps {
    session: Session,
    hide: Dispatch<SetStateAction<boolean>>,
    ref: Ref<HTMLDivElement>
}

export const UserStats = (props: UserStatsProps) => {
    const {session, hide, ref} = props;

    return (
        <div ref = {ref} className="flex flex-col border border-gray-200 shadow-lg rounded-md w-64 absolute right-0 top-full mt-5 p-4">
            <div className = "flex justify-center items-center right-0.5 top-0.5 cursor-pointer hover:bg-gray-200 rounded-full w-[24] h-[24] absolute transition" onClick={() => hide(false)}>
                <Image src="x.svg" alt="userStatsClose" height={20} width={20} />
            </div>
            <p className="font-bold text-center truncate">Welcome {session.user.email}</p>
            <LogOutButton className="mt-2"/>
        </div>
    )
}
