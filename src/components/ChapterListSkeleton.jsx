function ChapterListSkeleton() {
    return (
        <ul className="space-y-2 overflow-y-auto w-full max-h-100 custom-scrollbar">
            {Array.from({ length: 8 }).map((_, i) => (
                <li
                    key={i}
                    className="
                    p-3 rounded-2xl backdrop-blur-md shadow-2xl border border-white/20 dark:border-white/10
                    bg-white/35 dark:bg-black/30 animate-pulse"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        {/* Left side */}
                        <div className="flex items-center gap-3 min-w-0">

                            {/* Circle */}
                            <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10" />

                            {/* Text */}
                            <div className="flex flex-col gap-1 min-w-0 w-40 sm:w-56">
                                <div className="h-3 rounded bg-black/10 dark:bg-white/10 w-4/5" />
                                <div className="h-2 rounded bg-black/10 dark:bg-white/10 w-1/2" />
                            </div>
                        </div>
                        
                        {/* Right side */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                            <div className="h-5 w-18 rounded-full bg-black/10 dark:bg-white/10" />
                            <div className="h-3 w-16 rounded bg-black/10 dark:bg-white/10" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ChapterListSkeleton;