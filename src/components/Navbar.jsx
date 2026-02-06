import { Link } from "react-router-dom";
import NavSearch from "./NavSearch";
import DropDownMenu from "./DropDownMenu";
import { Icon } from "@iconify/react";
import { useState } from "react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return(
        <nav className="fixed top-0 w-full z-50 ">
            <div className="absolute inset-0 bg-main/60 dark:bg-main-dark/90 backdrop-blur-lg border-b border-white/30 dark:border-white/10 shadow-2xl z-0" />
            <div className="relative z-10 flex items-center justify-between w-full px-4 py-4 sm:px-6 lg:px-6">
                <Link to="/" className="text-lg sm:text-xl font-black tracking-tight hover:cursor-pointer text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-gray-300">
                    PanelVerse
                </Link>

                <div className="hidden md:flex gap-6 text-lg">
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-800 dark:text-white/90 hover:text-slate-900 dark:hover:text-white">Home</Link>
                    <Link to="/latest-release" className="text-slate-800 dark:text-white/90 hover:text-slate-900 dark:hover:text-white">Latest</Link>
                    <Link to="/browse" className="text-slate-800 dark:text-white/90 hover:text-slate-900 dark:hover:text-white">Browse</Link>
                    <Link to="/library" className="text-slate-800 dark:text-white/90 hover:text-slate-900 dark:hover:text-white">Library</Link>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <NavSearch variant="desktop"/>
                    <DropDownMenu />
                </div>

                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg bg-black/5 dark:bg-white/10">
                    <Icon 
                        icon={isOpen ? "material-symbols:close-rounded" : "stash:burger-classic-duotone"} 
                        className="text-2xl text-slate-900 dark:text-white"
                    />
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden relative z-10 px-4 pb-4 space-y-3">
                    <div className="flex flex-col gap-3 text-lg">
                        <Link to="/" className="text-slate-800 dark:text-white/90">Home</Link>
                        <Link to="/latest-release" className="text-slate-800 dark:text-white/90">Latest</Link>
                        <Link to="/browse" className="text-slate-800 dark:text-white/90">Browse</Link>
                        <Link to="/library" className="text-slate-800 dark:text-white/90">Library</Link>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <button 
                            onClick={() => setIsMobileOpen(true)}
                            className="flex items-center justify-center gap-1 w-full text-slate-700 bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/10 px-3 py-2 rounded-lg shadow-sm"
                        >
                            <Icon icon="ep:search" />
                            <span className="text-left flex-1">Search manga...</span>
                        </button>
                        <DropDownMenu />
                    </div>

                    {isMobileOpen && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col p-4 z-60">
                            <NavSearch 
                                onClose={() => setIsMobileOpen(false)} 
                                variant="mobile"
                            />
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar
