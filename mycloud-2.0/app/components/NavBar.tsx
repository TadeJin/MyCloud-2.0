import { MultipleFileOperations, SearchBar, UserInfo } from ".";

export const NavBar = () => {
    return (
        <div className="w-full h-12 md:h-16 flex items-center justify-start relative border-b border-stone-200 bg-white/70 backdrop-blur-sm">
            <SearchBar />
            <div className="hidden xl:block">
                <MultipleFileOperations />
            </div>
            <UserInfo hasSettings/>
        </div>
    );
}
