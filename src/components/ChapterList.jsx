import { getChapterBadge, getChapterTitle } from "../utils/formatChapter";

const ChapterList = ({
    chapters = [],
    loading,
    onChapterClick,
    chapterProgress = {},
    currentChapterId = null
}) => {

  return (
    <div className="mt-8 flex flex-col items-center">
        <div className="flex items-center gap-3 w-full mb-4">
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                Chapters
            </span>
            <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
            <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                {chapters.length > 0 ? chapters.length : "Unknown"}
            </span>
        </div>

        {loading ? (
            <p className="text-gray-400 text-sm">Loading chapters...</p>
        ) : chapters.length === 0 ? (
            <div 
                className="
                p-4 border border-white/20 dark:border-white/10 
                bg-white/35 dark:bg-black/30 rounded-2xl text-center 
                text-gray-500 backdrop-blur-md shadow-2xl"
            >
                <p className="text-gray-600 dark:text-gray-300">No chapters found</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Chapters will appear here when available
                </p>
            </div>
        ) : (
            <ul className="space-y-2 overflow-y-auto w-full max-h-100 custom-scrollbar">
                {chapters.map((ch) => {
                    const chapterBadge = getChapterBadge(ch);
                    const chapterTitle = getChapterTitle(ch);
                    const progress = chapterProgress?.[ch.id];
                    const isCurrent = currentChapterId === ch.id;
                    const isCompleted = Boolean(progress?.completed);
                    const hasProgress = Number.isInteger(progress?.lastPage);
                    const isInProgress = !isCompleted && hasProgress;
                    const showContinue = isCurrent && !isCompleted;
                    const totalPages = Number(progress?.totalPages);
                    const currentPage = Number(progress?.lastPage) + 1;
                    const progressLabel =
                        isInProgress && totalPages > 0
                            ? `Page ${Math.min(currentPage, totalPages)}/${totalPages}`
                            : isInProgress
                                ? "In progress"
                                : "";

                    const rowStyle = showContinue
                        ? "border-(--action)/50 bg-(--action)/10"
                        : isCompleted
                            ? "border-emerald-400/40 dark:border-emerald-500/30 bg-emerald-100/40 dark:bg-emerald-900/20 opacity-80"
                            : "border-white/20 dark:border-white/10 bg-white/35 dark:bg-black/30";
                    return (
                    <li
                        key={ch.id}
                        onClick={() => onChapterClick?.(ch.id)}
                        className={`
                            p-3 rounded-2xl hover:-translate-y-0.5 cursor-pointer
                            transition-all backdrop-blur-md shadow-2xl border ${rowStyle}
                        `}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span 
                                    className="
                                    w-8 h-8 shrink-0 flex items-center justify-center rounded-full 
                                    bg-black/5 dark:bg-white/10 text-(--text-main)/70 font-semibold text-sm"
                                >
                                    {chapterBadge}
                                </span>
                                <div className="min-w-0">
                                    <span className="block text-(--text-main) font-medium truncate">{chapterTitle}</span>
                                    {progressLabel && (
                                        <span className="text-xs text-black/60 dark:text-white/60">{progressLabel}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                                {showContinue && (
                                    <span 
                                        className="
                                        text-[10px] sm:text-xs font-semibold px-2 py-1 
                                        rounded-full bg-(--action)/50 text-black/80 dark:text-gray-100"
                                    >
                                        Continue
                                    </span>
                                )}
                                {isCompleted && (
                                    <span 
                                        className="
                                        text-[10px] sm:text-xs font-semibold px-2 py-1 
                                        rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                    >
                                        Read
                                    </span>
                                )}
                                {isInProgress && !isCurrent && (
                                    <span 
                                        className="
                                        text-[10px] sm:text-xs font-semibold px-2 py-1 
                                        rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                    >
                                        In Progress
                                    </span>
                                )}

                                <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                    {ch.publishedAt}
                                </div>
                            </div>
                        </div>
                    </li>
                    );
                })}
            </ul>
        )}
    </div>
  )
}

export default ChapterList
