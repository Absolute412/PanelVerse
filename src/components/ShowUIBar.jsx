import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReaderSettingsModal from "./ReaderSettingsModal";
import { getChapterLabel } from "../utils/formatChapter";

function ShowUIBar ({ 
    showUI, 
    setShowUI, 
    activeIdx, 
    setActiveIdx,
    pages, 
    scrollToPage,
    chapterTitle, 
    chapterLabel,
    chapters,
    chapterListDisplay,
    mangaId,
    mangaMeta,
    currentChapterId,
    prevChapter,
    nextChapter,
    readingMode,
    setReadingMode,
    displayMode,
    setDisplayMode,
    direction,
    setDirection,
    onOpenSettings
}) {
    const [openPageList, setOpenPageList] = useState(false);
    const [openChapterList, setOpenChapterList] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/manga/${mangaId}`)
    };

    const chapterItems = Array.isArray(chapterListDisplay) && chapterListDisplay.length > 0
        ? chapterListDisplay
        : chapters;

    const readingModeLabels = {
        single: "Single Page",
        continuous: "Continuous Vertical",
    };

    const displayModeLabels = {
        original: "Original Size",
        width: "Fit Width",
        screen: "Fit Screen",
    };

    return (
        <>
            {showUI && (
                <div
                    onClick={() => setShowUI(false)}
                    className="fixed inset-0 bg-black/40 z-40"
                />
            )}
            
            <aside
                className={`
                    fixed top-0 right-0 h-full w-full max-w-xs z-50 bg-(--main)
                    shadow-2xl transition-transform duration-300 ease-in-out flex flex-col gap-6
                    ${showUI ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                    <div className="flex items-center">
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-lg bg-(--component) hover:bg-(--component-hover) transition cursor-pointer"
                        >
                            <Icon icon="mdi:arrow-back" />
                        </button>
                    </div>
                    <div className="leading-tight flex flex-col items-center text-center">
                        <h3 className="font-bold text-lg text-(--text-main)">{chapterTitle}</h3>

                        {chapterLabel && (
                            <p className="text-xs text-(--text-muted) font-semibold truncate max-w-45">
                                {chapterLabel || "Chapter"}
                            </p>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setShowUI(false)}
                        className="p-2 rounded-lg bg-(--component) hover:bg-(--component-hover) transition cursor-pointer"
                        aria-label="Close sidebar"
                    >
                        <Icon icon="mdi:close" />
                    </button>
                </div>

                {/* Pages/Chapters panel */}
                <div className="flex flex-col gap-2">
                    {/* Pages */}
                    <div className="w-full px-4">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => scrollToPage(activeIdx - 1)}
                                disabled={activeIdx === 0}
                                className="
                                p-4 bg-(--component) hover:bg-(--component-hover) rounded-lg 
                                disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <Icon icon="mdi:chevron-left" />
                            </button>
                            
                            <div className="relative flex-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setOpenPageList(prev => !prev)
                                    }}
                                    className="
                                    w-full flex-1 flex items-center justify-between px-4 py-3 rounded-lg
                                    bg-(--component) hover:bg-(--component-hover) cursor-pointer"
                                >
                                    <span>Page {activeIdx +  1}</span>
                                    <Icon icon="mdi:chevron-up-down" />
                                </button>

                                {/* Page dropdown */}
                                {openPageList && (
                                    <div 
                                        className="
                                        absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-lg 
                                        bg-(--component) border border-white/10 custom-scrollbar z-50"
                                    >
                                        {pages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (readingMode === "single") {
                                                        setActiveIdx(idx)
                                                    } else {
                                                        scrollToPage(idx);
                                                    }

                                                    setOpenPageList(false);
                                                }}
                                                className={`
                                                    block w-full text-left px-4 py-2 hover:bg-(--component-hover) cursor-pointer
                                                    ${idx === activeIdx ? "bg-(--main)" : ""}
                                                `}
                                            >
                                                Page {idx + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => scrollToPage(activeIdx + 1)} 
                                disabled={activeIdx === pages.length - 1}
                                className="
                                p-4 bg-(--component) hover:bg-(--component-hover) rounded-lg 
                                disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <Icon icon="mdi:chevron-right" />
                            </button>

                        </div>
                    </div>

                    {/* Chapters */}
                    <div className="w-full px-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => 
                                    prevChapter &&
                                    navigate(`/read/${mangaId}/${prevChapter.id}`, {
                                        state: { chapters, manga: mangaMeta },
                                    })
                                }
                                disabled={!prevChapter}
                                className="
                                p-4 bg-(--component) hover:bg-(--component-hover) rounded-lg 
                                disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <Icon icon="mdi:chevron-left" />
                            </button>
                            
                            {/* Chapter display + dropdown */}
                            <div className="relative flex-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setOpenChapterList(p => !p)
                                    }}
                                    className="
                                    w-full flex-1 flex items-center justify-between px-4 py-3 rounded-lg
                                    bg-(--component) hover:bg-(--component-hover) cursor-pointer"
                                >
                                    <span>{chapterLabel}</span>
                                    <Icon icon="mdi:chevron-up-down" />
                                </button>

                                {/* Page dropdown */}
                                {openChapterList && (
                                    <div 
                                        className="
                                        absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-lg 
                                        bg-(--component) border border-white/10 custom-scrollbar z-50"
                                    >
                                        {chapterItems.map((ch, idx) => {
                                            const isActive = ch.id === currentChapterId;

                                            return (
                                                <button
                                                    key={ch.id}
                                                    onClick={() => 
                                                        navigate(`/read/${mangaId}/${ch.id}`, {
                                                            state: { chapters, manga: mangaMeta },
                                                        })
                                                    }
                                                    className={`
                                                        block w-full text-left px-4 py-2 hover:bg-(--component-hover) cursor-pointer
                                                        ${isActive ? "bg-(--main)" : ""}
                                                    `}
                                                >
                                                    {getChapterLabel(ch) || `Chapter ${idx + 1}`}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => 
                                    navigate(`/read/${mangaId}/${nextChapter.id}`, {
                                        state: { chapters, manga: mangaMeta },
                                    })
                                } 
                                disabled={!nextChapter}
                                className="
                                p-4 bg-(--component) hover:bg-(--component-hover) rounded-lg 
                                disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <Icon icon="mdi:chevron-right" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-2">
                    <div className="h-px bg-black/10 dark:bg-white/10 my-1 mx-4"/>
                </div>

                {/* Page settings */}
                <div className="flex flex-col gap-2 px-4">
                    {/* Page layout */}
                    <button 
                        onClick={() =>
                            setReadingMode(prev => prev === "single" ? "continuous" : "single")
                        }
                        className="flex items-center gap-2 w-full p-3 rounded-lg bg-(--component) 
                        hover:bg-(--component-hover) cursor-pointer"
                    >
                        <Icon 
                            icon={readingMode === "single" ? "mdi:file-document-outline" : "mingcute:spacing-vertical-line"} 
                            className="text-xl shrink-0" 
                        />
                        <span>{readingModeLabels[readingMode]}</span>
                    </button>

                    {/* Page size */}
                    <button
                        onClick={() =>
                            setDisplayMode(prev =>
                                prev === "original"
                                    ? "width"
                                    : prev === "width"
                                    ? "screen"
                                    : "original"
                            )
                        }
                        className="
                        flex items-center gap-2 w-full p-3 rounded-lg bg-(--component) 
                        hover:bg-(--component-hover) text-left text-(--text-main) cursor-pointer"
                    >
                        {/* Icon name switches with display mode; keep props standard to avoid invalid DOM attributes. */}
                        <Icon
                            icon={
                                displayMode === "original" 
                                ? "mdi:image-outline" 
                                : displayMode === "width"
                                ? "ix:width"
                                : "ix:height" 
                            } 
                            className="text-xl shrink-0" 
                         />
                        <span>{displayModeLabels[displayMode]}</span>
                    </button>

                    {/* Page navigation */}
                    <button 
                        onClick={() =>
                            setDirection(prev => prev === "ltr" ? "rtl" : "ltr")
                        }
                        className="
                        flex items-center gap-2  w-full p-3 rounded-lg bg-(--component) 
                        hover:bg-(--component-hover) text-left text-(--text-main) cursor-pointer"
                    >
                        <Icon icon="mdi:swap-horizontal" className="text-xl shrink-0" />
                        <span>{direction === "ltr" ? "Left to right" : "Right to left"}</span>
                    </button>

                    {/* Reader settings */}
                    <button 
                        onClick={onOpenSettings}
                        className="
                        flex items-center gap-2 w-full p-3 rounded-lg bg-(--component) 
                        hover:bg-(--component-hover) text-left text-(--text-main) cursor-pointer"
                    >
                        <Icon icon="mdi:cog-outline" className="text-xl shrink-0" />
                        <span>Reader settings</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default ShowUIBar
