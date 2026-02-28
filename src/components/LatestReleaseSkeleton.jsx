function LatestReleaseSkeleton({ count = 10 }) {
  return (
    <div className="h-full">
      <div
        className="
          grid grid-flow-row md:grid-flow-col
          grid-cols-1 md:auto-cols-fr md:grid-rows-5 gap-4
        "
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="
              flex gap-3 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
              p-3 rounded-2xl backdrop-blur-md shadow-2xl
            "
          >
            <div className="w-18 h-24 bg-white/20 dark:bg-white/10 rounded-lg shrink-0 animate-pulse" />

            <div className="flex flex-col justify-between w-full">
              <div className="space-y-2">
                <div className="h-4 w-11/12 rounded bg-white/20 dark:bg-white/10 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-white/20 dark:bg-white/10 animate-pulse" />
              </div>

              <div className="flex flex-row justify-between items-center gap-2">
                <div className="h-6 w-20 rounded-full bg-white/20 dark:bg-white/10 animate-pulse" />
                <div className="h-4 w-16 rounded bg-white/20 dark:bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestReleaseSkeleton;
