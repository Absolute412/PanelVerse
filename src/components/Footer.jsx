import { Link } from "react-router-dom";
import { PanelVerseLogo } from "./PanelVerseLogo";

function Footer() {
    const footerNav = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Settings", path: "/settings" },
    ];
    
    return(
        <footer className="relative mt-8">
            <div className="absolute inset-0 backdrop-blur-lg border-t border-white/30 dark:border-white/10" />
            <div className="relative max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-slate-800 dark:text-white">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-lg font-black tracking-tight">
                        <PanelVerseLogo />
                        <h1>PanelVerse</h1>
                    </div>
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-(--text-main)/60">
                        Discover Manga
                    </span>
                </div>

                <ul className="flex flex-wrap gap-6 text-sm">
                    {footerNav.map((item) => (
                        <Link
                            key={item.path} 
                            to={item.path}
                            className="text-(--text-main) hover:text-(--text-muted)"
                        >
                            {item.name}
                        </Link>
                    ))}
                </ul>

                <div className="text-sm text-(--text-main)/70">
                    © {new Date().getFullYear()} PanelVerse. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer
