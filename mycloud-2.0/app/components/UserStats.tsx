import { Session } from "next-auth";
import { LogOutButton } from ".";
import { Dispatch, SetStateAction } from "react";

interface UserStatsProps {
    session: Session,
    hide: Dispatch<SetStateAction<boolean>>
}

export const UserStats = (props: UserStatsProps) => {
    const {session, hide} = props;

    return (
        <div className="flex flex-col outline-4 outline-black rounded-md w-full absolute right-0 top-full mt-5">
            <div className = "flex justify-center items-center right-0.5 top-0.5 hover: cursor-pointer hover:bg-gray-500 rounded-full w-[24] h-[24] absolute" onClick={() => hide(false)}>
                <svg  xmlns="http://www.w3.org/2000/svg" width="22" height="22"  
                    fill="currentColor" viewBox="0 0 24 24" >
                    <path d="m7.76 14.83-2.83 2.83 1.41 1.41 2.83-2.83 2.12-2.12.71-.71.71.71 1.41 1.42 3.54 3.53 1.41-1.41-3.53-3.54-1.42-1.41-.71-.71 5.66-5.66-1.41-1.41L12 10.59 6.34 4.93 4.93 6.34 10.59 12l-.71.71z"></path>
                </svg>
            </div>
            <p className="font-bold text-center">Welcome {session.user.email}</p>
            <LogOutButton className="mt-2"/>
        </div>
    )
}
