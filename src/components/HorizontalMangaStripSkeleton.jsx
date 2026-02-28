function HorizontalMangaStripSkeleton({ count = 8 }) {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div className="flex flex-row gap-4 pb-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="
              flex-none w-34 sm:w-60 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
              rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md
            "
          >
            <div className="relative">
              <div className="w-full h-42 sm:h-80 bg-white/20 dark:bg-white/10 animate-pulse" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 via-black/5 to-transparent" />
            </div>
            <div className="p-2 sm:p-4">
              <div className="h-4 w-5/6 rounded bg-white/20 dark:bg-white/10 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorizontalMangaStripSkeleton;
