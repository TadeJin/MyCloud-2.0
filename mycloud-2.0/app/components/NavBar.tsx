import { Session } from "next-auth"
import Image from "next/image";
import { UserInfo } from "./UserInfo";

interface NavBarProps {
    session: Session
}

export const NavBar = (props: NavBarProps) => {
    const {session} = props;

    return (
        <div className="w-full h-12 flex items-center">
            <div className="flex items-center mr-auto">
                <Image
                    src="/logo.svg"
                    alt="MyCloud logo"
                    width={300}
                    height={150}
                    className="object-contain mt-10"
                />
            </div>

            <UserInfo session={session} />
        </div>
    )
}
