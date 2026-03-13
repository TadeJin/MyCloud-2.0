import { Session } from "next-auth"
import Image from "next/image";
import favicon from "../../public/favicon.ico";
import { UserInfo } from "./UserInfo";

interface NavBarProps {
    session: Session
}

export const NavBar = (props: NavBarProps) => {
    const {session} = props;

    return (
        <div className="flex place-items-top w-screen items-center h-12">
            <Image src={favicon} alt="favicon" width={24} height={24}/>
            <UserInfo session={session}/>
        </div>
    )
}
