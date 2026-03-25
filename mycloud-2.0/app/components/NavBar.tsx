import { Session } from "next-auth"
import { UserInfo } from "./UserInfo";

interface NavBarProps {
    session: Session
}

export const NavBar = (props: NavBarProps) => {
    const {session} = props;

    return (
        <div className="w-full h-16 flex items-center">
            <UserInfo session={session} />
        </div>
    );
}
