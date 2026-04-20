import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import LayoutSettings from "./LayoutSettings";
import GeneralSettings from "./GeneralSettings";

function ReaderSettingsModal ({ 
    isOpen, 
    onClose ,
    readingMode,
    setReadingMode,
    displayMode,
    setDisplayMode,
    direction,
    setDirection,
    backgroundColors,
    setBackgroundColors,
    progressBar,
    setProgressBar,
    progressBarPositon,
    setProgressBarPosition,
}) {
    const [activeSection, setActiveSection] = useState("layout");

    const sections = [
        {
            id: "layout", 
            label: "Page Layout", 
            content: (
                <LayoutSettings
                  readingMode={readingMode}  
                  setReadingMode={setReadingMode}
                  displayMode={displayMode}
                  setDisplayMode={setDisplayMode}
                  direction={direction}
                  setDirection={setDirection}
                />
            )
        },
        {
            id: "general", 
            label: "General", 
            content: (
                <GeneralSettings 
                    backgroundColors={backgroundColors}
                    setBackgroundColors={setBackgroundColors}
                    progressBar={progressBar}
                    setProgressBar={setProgressBar}
                    progressBarPosition={progressBarPositon}
                    setProgressBarPosition={setProgressBarPosition}
                />
            )
        }
    ];

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center"
            >
                {/* Modal + stop click bubbling */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="
                    relative flex items-center w-full max-w-lg pointer-events-auto p-4 bg-(--main) rounded-lg "
                >
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-(--text-main)">Reader Settings</h1>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg bg-(--component) hover:bg-(--component-hover) cursor-pointer"
                            >
                                <Icon icon="material-symbols:close-rounded" />
                            </button>
                        </div>

                        <div className="flex gap-2 min-h-75">
                            <div className="flex flex-row gap-2">
                                {/* Control navs */}
                                <div className="flex flex-col gap-2 w-35 border-r border-black/10 dark:border-white/10 pr-3">
                                    {sections.map((section) => {
                                        const isActive = activeSection === section.id;

                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`
                                                    text-center text-sm text-(--text-main) px-3 py-2 rounded-lg transition cursor-pointer 
                                                    ${isActive 
                                                        ? "bg-(--component) font-medium" 
                                                        : "hover:bg-(--component-hover)"
                                                    }
                                                `}
                                            >
                                                {section.label}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/*Right content*/}
                                <div className="flex-1 overflow-y-auto pr-2">
                                    {sections.find(s => s.id === activeSection)?.content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReaderSettingsModal;