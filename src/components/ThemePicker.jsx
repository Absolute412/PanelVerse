import { useTheme } from "../contexts/ThemeContext";

const ThemePicker = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "dark", color: "#0A0F1E" },      // Dark/Black → Midnight Dark
    { id: "blue", color: "#93C5FD" },      // Blue → Midnight Blue
    { id: "purple", color: "#C7BFFF" },    // Purple → Midnight Purple
  ];

  return (
    <div className="flex gap-4 items-center justify-center mt-4">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`w-10 h-10 rounded-full border-2 transition-transform ${
            theme === t.id ? "scale-110 border-white shadow-lg" : "border-gray-300"
          }`}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  );
};

export default ThemePicker;
