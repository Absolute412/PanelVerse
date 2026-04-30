import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../contexts/LibraryContext";
import {
    clearAllReadingProgress,
    getLibrarySortPreference,
    getReadingProgressStats,
    setLibrarySortPreference,
} from "../utils/storageService";

function LibrarySettings() {
    const navigate = useNavigate();
    const { library, clearLibrary } = useLibrary();
    const [sortPreference, setSortPreference] = useState(getLibrarySortPreference());
    const [confirmAction, setConfirmAction] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [stats, setStats] = useState(() => getReadingProgressStats());

    const libraryCount = library.length;

    const trackedLabel = useMemo(() => {
        const mangaLabel = `${stats.mangaTracked} title${stats.mangaTracked === 1 ? "" : "s"}`;
        const chapterLabel = `${stats.chaptersTracked} chapter${stats.chaptersTracked === 1 ? "" : "s"} tracked`;
        return `${mangaLabel}, ${chapterLabel}`;
    }, [stats]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSortChange = (event) => {
        const nextSort = event.target.value;
        setSortPreference(nextSort);
        setLibrarySortPreference(nextSort);
        setStatusMessage("Library sort preference updated.");
    };

    const handleConfirmAction = () => {
        if (confirmAction === "progress") {
            clearAllReadingProgress();
            setStats(getReadingProgressStats());
            setStatusMessage("Reading progress cleared.");
        }

        if (confirmAction === "library") {
            clearLibrary();
            setStatusMessage("Library cleared.");
        }

        setConfirmAction(null);
    };

    return (
        <div className="flex-1 items-center pt-20">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-10">
                <div className="flex items-center gap-3 w-full my-2">
                    <button
                        onClick={handleBack}
                        className="
                        p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200
                        hover:bg-gray-200/60 dark:hover:bg-gray-500/40 transition cursor-pointer"
                        aria-label="Go back"
                    >
                        <Icon icon="eva:arrow-back-fill" />
                    </button>
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-(--text-main)/70">
                        Library Settings
                    </span>
                    <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                </div>

                <p className="text-sm text-(--text-muted) mt-2">
                    Manage library behavior and reset local data safely.
                </p>

                <div
                    className="
                    mt-4 w-full bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
                    rounded-2xl shadow-2xl backdrop-blur-md p-4"
                >
                    <p className="text-base font-semibold text-(--text-main)">Library Overview</p>
                    <p className="text-sm text-(--text-muted) mt-1">
                        {libraryCount} title{libraryCount === 1 ? "" : "s"} in your library.
                    </p>
                    <p className="text-sm text-(--text-muted)">{trackedLabel}</p>
                </div>

                <div
                    className="
                    mt-3 w-full bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
                    rounded-2xl shadow-2xl backdrop-blur-md p-4"
                >
                    <label htmlFor="library-sort" className="text-base font-semibold text-(--text-main)">
                        Default Library Sort
                    </label>
                    <p className="text-sm text-(--text-muted) mt-1">
                        Choose how manga is ordered on your Library page.
                    </p>
                    <div className="relative mt-3 w-full sm:max-w-xs">
                        <select
                            id="library-sort"
                            value={sortPreference}
                            onChange={handleSortChange}
                            className="
                            w-full appearance-none rounded-lg border border-black/10 dark:border-white/15
                            bg-(--component) text-slate-900 dark:text-slate-100
                            px-3 py-2 pr-10 outline-none shadow-sm
                            focus:ring-2 focus:ring-(--action)/50 cursor-pointer"
                        >
                            <option value="recently-added">Recently added</option>
                            <option value="recently-read">Recently read</option>
                            <option value="alphabetical">A to Z</option>
                        </select>
                        <Icon
                            icon="mdi:chevron-down"
                            className="
                            pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                            text-slate-600 dark:text-slate-300"
                        />
                    </div>
                </div>

                <div
                    className="
                    mt-3 w-full bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
                    rounded-2xl shadow-2xl backdrop-blur-md p-4"
                >
                    <p className="text-base font-semibold text-(--text-main)">Reset Actions</p>
                    <p className="text-sm text-(--text-muted) mt-1">
                        These actions affect local data only and cannot be undone.
                    </p>

                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <button
                            type="button"
                            onClick={() => setConfirmAction("progress")}
                            className="
                            w-full sm:w-auto px-4 py-2 rounded-lg font-semibold
                            bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20
                            text-(--text-main) cursor-pointer"
                        >
                            Clear Reading Progress
                        </button>

                        <button
                            type="button"
                            onClick={() => setConfirmAction("library")}
                            className="
                            w-full sm:w-auto px-4 py-2 rounded-lg font-semibold
                            bg-red-600/90 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Clear Library
                        </button>
                    </div>
                </div>

                {confirmAction && (
                    <div
                        className="
                        mt-3 w-full bg-amber-500/15 border border-amber-600/30
                        rounded-2xl shadow-2xl backdrop-blur-md p-4"
                    >
                        <p className="text-sm font-semibold text-(--text-main)">
                            {confirmAction === "progress"
                                ? "Clear all reading progress for every manga?"
                                : "Remove every title from your library?"}
                        </p>
                        <p className="text-xs text-(--text-muted) mt-1">
                            This action is permanent for this device unless you restore from backup.
                        </p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                onClick={handleConfirmAction}
                                className="
                                w-full sm:w-auto px-4 py-2 rounded-lg font-semibold
                                bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                            >
                                Yes, continue
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmAction(null)}
                                className="
                                w-full sm:w-auto px-4 py-2 rounded-lg font-semibold
                                bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20
                                text-(--text-main) cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {statusMessage && (
                    <p className="text-xs text-black/70 dark:text-white/70 mt-3">{statusMessage}</p>
                )}
            </div>
        </div>
    );
}

export default LibrarySettings;
