import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";
import { PanelVerseLogo } from "./PanelVerseLogo";
// "material-symbols:close-rounded"

const dropdownLinks = [
    {
        "name": "Settings",
        "icon": <Icon icon="line-md:cog-loop" />,
        "path": "/settings"
    },
    {
        "name": "About",
        "icon": <Icon icon="mdi:about-circle-outline" />,
        "path": "/about"
    },
];

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
                className="
                flex items-center justify-center p-1 rounded-lg 
                bg-(--component) transition-transform duration-200 cursor-pointer"
                aria-expanded={open}
                aria-label="Open user menu"
            >
                <Icon 
                    icon="mdi:dots-vertical"
                    className={`
                        text-2xl dark:text-white transition-transform duration-200 ${
                            open ? "rotate-90" : "rotate-0"
                        }`}
                />
            </button>

            {open && (
                <div 
                    className={`
                    absolute right-0 mt-4 mr-1 w-52 sm:w-56 md:w-60 bg-(--main)/95 rounded-2xl
                    p-3 sm:p-4 text-sm z-50 shadow-xl border border-black/5 dark:border-white/10 backdrop-blur-md
                    transform transition-all duration-200 ease-out origin-top-right
                    ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`
                }>
                    <div className="flex items-center gap-3 rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2 mb-3">
                        <PanelVerseLogo size={32} />
                        <div className="leading-tight">
                            <h4 className="font-extrabold text-base text-(--text-main)">PanelVerse</h4>
                            <p className="text-xs text-(--text-muted)">Explore the PanelVerse</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {dropdownLinks.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                className="
                                flex items-center justify-start gap-3 w-full px-3 py-2 hover:bg-(--component) rounded-lg transition-colors"
                            >
                                <span className="flex h-8 w-8 text-lg items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                                    {item.icon}
                                </span>

                                <p className="text-sm font-medium text-(--text-main)/90">{item.name}</p>
                            </Link>
                        ))}
                        <div className="h-px bg-black/10 dark:bg-white/10 my-1"/>
                        <ToggleTheme />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropDownMenu
