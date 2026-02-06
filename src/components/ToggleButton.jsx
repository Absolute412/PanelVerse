import { useTheme } from "../contexts/ThemeContext";

const ToggleButton = () => {
    const  {isDark, setIsDark} = useTheme();
    const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="w-full flex items-center justify-between bg-component dark:bg-component-dark dark:hover:bg-component-hover-dark
                                    rounded-xl shadow-sm border border-component dark:border-gray-500 p-4 hover:shadow-md hover:bg-component-light-hover transition"
    >
        <p className="text-base font-medium text-gray-700 dark:text-white">Change Theme</p>
        <label className="relative cursor-pointer">
            <input
                type="checkbox" 
                className="sr-only peer" 
                checked={isDark}
                onChange={ toggleTheme }
            />
            <div className="w-11 h-6 bg-primary dark:peer-checked:bg-primary-dark rounded-full transition-all duration-300"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>
        </label>
    </div>
  )
}

export default ToggleButton