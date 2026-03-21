import { Session } from "next-auth"
import Image from "next/image";
import { UserInfo } from "./UserInfo";

interface NavBarProps {
    session: Session
}

export const NavBar = (props: NavBarProps) => {
    const {session} = props;

    return (
        <div className="w-full h-12 px-6 flex items-center justify-between">
            <div className="flex items-center">
                <Image
                    src="/logo.svg"
                    alt="MyCloud logo"
                    width={250}
                    height={40}
                    className="object-contain mt-10 mr-auto"
                />
            </div>

            <UserInfo session={session} />
        </div>
    )
}
