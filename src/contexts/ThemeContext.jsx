import { createContext, useContext, useEffect, useState } from "react";
import { getThemePreference, setThemePreference } from "../utils/storageService";

const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [isDark, setIsDark] = useState(() => {
        return getThemePreference() === "dark";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        setThemePreference(isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{isDark, setIsDark}}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    return useContext(ThemeContext);
}
