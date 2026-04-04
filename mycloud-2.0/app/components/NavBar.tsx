import { MultipleFileOperations, SearchBar, UserInfo } from ".";

export const NavBar = () => {
    return (
        <div className="w-full h-12 md:h-16 flex items-center justify-start relative">
            <SearchBar />
            <div className="hidden md:block">
                <MultipleFileOperations />
            </div>
            <UserInfo hasSettings/>
        </div>
    );
}
