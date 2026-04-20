import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Icon } from "@iconify/react";

function Appearance() {
    const { mode, theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const themes = [
        {
            name: "Default",
            value: "default",
            description: "Clean blue tone with soft contrast.",
        },
        {
            name: "Purple",
            value: "purple",
            description: "Vibrant lilac styling with bold accents.",
        },
        {
            name: "Neutral",
            value: "neutral",
            description: "Balanced monochrome look for readability.",
        },
    ];

    const previewByTheme = {
        default: {
            light: {
                surface: "#E6F0FF",
                action: "#3B82F6",
                alt: "#60A5FA",
                text: "#0F172A",
                muted: "#64748B",
            },
            dark: {
                surface: "#151D36",
                action: "#26336B",
                alt: "#32448F",
                text: "#E5E7EB",
                muted: "#94A3B8",
            },
        },
        purple: {
            light: {
                surface: "#ECE8FF",
                action: "#8B5CF6",
                alt: "#A78BFA",
                text: "#1F193A",
                muted: "#6D62A6",
            },
            dark: {
                surface: "#1B153A",
                action: "#3A2C7A",
                alt: "#8B5CF6",
                text: "#EFEAFF",
                muted: "#B9A8EE",
            },
        },
        neutral: {
            light: {
                surface: "#F1F5F9",
                action: "#334155",
                alt: "#64748B",
                text: "#0F172A",
                muted: "#64748B",
            },
            dark: {
                surface: "#0F172A",
                action: "#334155",
                alt: "#475569",
                text: "#F1F5F9",
                muted: "#94A3B8",
            },
        },
    };

    return (
        <div className="flex-1 items-center pt-20">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-3 w-full my-2">
                    <button 
                        onClick={handleBack} 
                        className="
                        p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 
                        hover:bg-gray-200/60 dark:hover:bg-gray-500/40 transition cursor-pointer"
                        aria-label="Go back"
                    >
                        <Icon icon="eva:arrow-back-fill"/>
                    </button>
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-(--text-main)/70">
                        Appearance
                    </span>
                    <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                </div>

                <p className="text-sm text-(--text-muted) mt-2">
                    Theme mode
                </p>

                <div className="py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {themes.map((t) => {
                            const selected = theme === t.value;
                            const palette = previewByTheme[t.value][mode];

                            return (
                            <button
                                key={t.value}
                                onClick={() => setTheme(t.value)}
                                className={`
                                    p-4 rounded-2xl border cursor-pointer transition-all duration-300 text-left
                                    hover:-translate-y-1 hover:shadow-lg
                                    ${selected
                                        ? "ring-2 ring-(--action) border-(--action) bg-(--component-hover)"
                                        : "border-(--component) hover:border-(--action)/50"
                                    }
                                `}
                            >
                                <div
                                    className="h-10 rounded-lg mb-3 p-2 flex items-center justify-between"
                                    style={{ backgroundColor: palette.surface }}
                                >
                                    <span
                                        className="h-3 w-12 rounded-full"
                                        style={{ backgroundColor: palette.action }}
                                    />
                                    <span
                                        className="h-3 w-6 rounded-full"
                                        style={{ backgroundColor: palette.alt }}
                                    />
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p
                                            className="text-sm font-semibold"
                                            style={{ color: palette.text }}
                                        >
                                            {t.name}
                                        </p>
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: palette.muted }}
                                        >
                                            {t.description}
                                        </p>
                                    </div>
                                    {selected && (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-(--action)/20 text-(--text-main) font-semibold">
                                            Active
                                        </span>
                                    )}
                                </div>
                            </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Appearance
