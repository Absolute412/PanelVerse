import { Link } from "react-router-dom";

function Footer() {
    
    return(
        <footer className="relative">
            <div className="absolute inset-0 bg-main/60 dark:bg-main-dark/90 backdrop-blur-lg border-t border-white/30 dark:border-white/10" />
            <div className="relative max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-slate-800 dark:text-white">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-black tracking-tight">PanelVerse</span>
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/60 dark:text-white/60">
                        Discover Manga
                    </span>
                </div>

                <ul className="flex flex-wrap gap-6 text-sm font-semibold">
                    <li><Link to="#" className="hover:underline">About</Link></li>
                    <li><Link to="#" className="hover:underline">Contact</Link></li>
                    <li><Link to="#" className="hover:underline">Terms</Link></li>
                </ul>

                <div className="text-sm text-black/70 dark:text-white/70">
                    <p>&copy; {new Date().getFullYear()} PanelVerse. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer
