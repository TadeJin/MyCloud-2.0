import { Session } from "next-auth"
import { UserInfo } from "./UserInfo";
import { SearchBar } from "./SearchBar";

interface NavBarProps {
    session: Session
}

export const NavBar = (props: NavBarProps) => {
    const {session} = props;

    return (
        <div className="w-full h-16 flex items-center justify-between">
            <SearchBar />
            <UserInfo session={session} />
        </div>
    );
}
