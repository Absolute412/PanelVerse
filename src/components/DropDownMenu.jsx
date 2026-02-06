import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";
// "material-symbols:close-rounded"

function DropDownMenu () {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return(
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setOpen(!open)} 
                className="flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105"
                aria-expanded={open}
                aria-label="Open user menu"
            >
                <Icon icon="iconamoon:profile" className="text-2xl dark:text-white" />
            </button>

            {open && (
                <div className={
                    `absolute right-0 mt-4 mr-1 w-52 sm:w-56 md:w-60 bg-main/95 dark:bg-component-dark/95 rounded-2xl
                    p-3 sm:p-4 text-sm z-50 shadow-xl border border-black/5 dark:border-white/10 backdrop-blur-md
                    transform transition-all duration-200 ease-out origin-top-right
                    ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`
                }>
                    <div className="flex items-center gap-3 rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2 mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70 dark:bg-white/10">
                            <Icon icon="mdi:account-outline" className="text-xl text-gray-700 dark:text-gray-200" />
                        </div>
                        <div className="leading-tight">
                            <h4 className="font-semibold text-base text-gray-800 dark:text-white">Guest</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-300">Manga Reader</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                    <Link 
                        to="/profile" 
                        className="
                            flex items-center justify-start gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700
                            dark:text-gray-200 hover:bg-main dark:hover:bg-component-hover-dark rounded-lg transition-colors
                        ">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                            <Icon icon="mdi:account-outline" className="text-lg"/>
                        </span> 
                        Profile
                    </Link>
                    <Link 
                        to="/settings" 
                        className="
                            flex items-center justify-start gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 
                            dark:text-gray-200 hover:bg-main dark:hover:bg-component-hover-dark rounded-lg transition-colors
                        ">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                            <Icon icon="line-md:cog-loop" className="text-lg"/>
                        </span> 
                        Settings
                    </Link>
                    <div className="h-px bg-black/10 dark:bg-white/10 my-1"/>
                    <ToggleTheme />
                    {/* <div className="h-px bg-black/10 dark:bg-white/10 my-1"/>
                    <Link to="/profile" className="flex items-center justify-start gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-main dark:hover:bg-component-hover-dark rounded-lg transition-colors">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                            <Icon icon="stash:signin" className="text-lg"/>
                        </span> 
                        Sign In
                    </Link> */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropDownMenu
