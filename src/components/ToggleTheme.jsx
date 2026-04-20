import { Icon } from "@iconify/react";
import { useTheme } from "../contexts/ThemeContext";

const ToggleTheme = ({ compact = false }) => {
    const { mode, setMode } = useTheme();
    const toggleTheme = () => setMode(mode === "dark" ? "light" : "dark");

    if (compact) {
        return (
            <button
                onClick={toggleTheme}
                className="
                    flex items-center justify-center w-10 h-10 rounded-lg
                    bg-(--component) border border-white/20 dark:border-white/10
                    transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
                <Icon
                    icon={mode === "dark" ? "ph:moon-stars-fill" : "ph:sun-fill"}
                    className="text-xl text-(--accent)"
                />
            </button>
        );
    }

    return (
        <div className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 dark:bg-white/10">
                    <Icon 
                        icon={mode === "dark" ? "ph:moon-stars-fill" : "ph:sun-fill"} 
                        className="text-lg text-yellow-500 dark:text-blue-300" 
                    />
                </span>
                <div className="leading-tight">
                    <p className="text-sm font-semibold text-(--text-main)/80">Theme</p>
                    <p className="text-xs text-(--text-muted)">
                        {mode === "dark" ? "Dark mode" : "Light mode"}
                    </p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={mode === "dark"}
                    onChange={ toggleTheme }
                    aria-label="Toggle dark mode"
                />
                <div className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-(--primary) transition-colors duration-300"></div>
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-6"></div>
            </label>
        </div>
    );
}

export default ToggleTheme
