import { MultipleFileOperations, SearchBar, UserInfo } from ".";

export const NavBar = () => {
    return (
        <div className="w-full h-12 md:h-16 flex items-center justify-start relative border-b border-stone-200 bg-stone-100 backdrop-blur-sm z-10 pl-5">
            <SearchBar />
            <div className="hidden xl:block">
                <MultipleFileOperations />
            </div>
            <UserInfo hasSettings/>
        </div>
    );
}
