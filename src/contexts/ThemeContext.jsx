import { createContext, useContext, useEffect, useState } from "react";
import { getColorTheme, getModePreference, setColorTheme, setModePreference } from "../utils/storageService";

const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [mode, setMode] = useState(getModePreference());
    const [theme, setTheme] = useState(getColorTheme());

    useEffect(() => {
        const root = document.documentElement;

        // Dark mode
        root.classList.toggle("dark", mode === "dark");
        setModePreference(mode);

        // Color theme
        root.classList.remove("theme-purple", "theme-neutral");

        if (theme === "purple") root.classList.add("theme-purple");
        if (theme === "neutral") root.classList.add("theme-neutral");

        setColorTheme(theme);
    }, [mode, theme]);

    return (
        <ThemeContext.Provider value={{ mode, setMode, theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    return useContext(ThemeContext);
}
