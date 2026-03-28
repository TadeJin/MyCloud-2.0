import { Session } from "next-auth"
import { MultipleFileOperations, SearchBar, UserInfo } from ".";

interface NavBarProps {
    session: Session
}

export const NavBar = (props: NavBarProps) => {
    const {session} = props;

    return (
        <div className="w-full h-16 flex items-center justify-between">
            <SearchBar />
            <MultipleFileOperations />
            <UserInfo session={session} />
        </div>
    );
}
