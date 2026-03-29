import { MultipleFileOperations, SearchBar, UserInfo } from ".";

export const NavBar = () => {
    return (
        <div className="w-full h-16 flex items-center justify-between">
            <SearchBar />
            <MultipleFileOperations />
            <UserInfo hasSettings/>
        </div>
    );
}
