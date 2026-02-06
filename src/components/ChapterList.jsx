const ChapterList = ({chapters = [], loading, onChapterClick}) => {

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
            <div className="p-4 border border-white/20 dark:border-white/10 bg-white/35 dark:bg-black/30 rounded-2xl text-center text-gray-500 backdrop-blur-md shadow-2xl">
                <p className="text-gray-600 dark:text-gray-300">No chapters found</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Chapters will appear here when available
                </p>
            </div>
        ) : (
            <ul className="space-y-2 overflow-y-auto w-full max-h-100 custom-scrollbar">
                {chapters.map((ch) => (
                    <li
                        key={ch.id}
                        onClick={() => onChapterClick?.(ch.id)}
                        className="flex items-center justify-between p-3 border border-white/20 dark:border-white/10 bg-white/35 dark:bg-black/30 rounded-2xl hover:-translate-y-0.5 cursor-pointer transition-transform backdrop-blur-md shadow-2xl"
                    >
                        <div className="flex items-center gap-3">
                            {/* Chapter Number Badge */}
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-black/70 dark:text-gray-200 font-semibold text-sm">
                                {ch.number}
                            </span>

                            {/* Chapter Title */}
                            <span className="text-gray-800 dark:text-gray-200 font-medium">{ch.title}</span>
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-200">
                            {ch.publishedAt}
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default ChapterList
