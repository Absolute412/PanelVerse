function HeroSkeleton() {
    return (
        <section className="relative bg-main dark:bg-main-dark min-h-[calc(58vh-4rem)] sm:min-h-[calc(80vh-4rem)] flex items-start sm:items-center overflow-hidden">
            <div className="absolute inset-0">
                <div className="w-full h-full bg-black/10 dark:bg-black/30 animate-pulse" />
                <div className="absolute inset-0 bg-linear-to-tr from-black/25 via-black/10 to-transparent dark:from-black/60 dark:via-black/20 dark:to-transparent" />
            </div>

            <div className="flex flex-col px-4 pt-2 sm:pt-0 gap-3 sm:gap-4 z-10 w-full">
                <div className="flex items-center gap-3 mt-1 sm:mt-4">
                    <div className="h-3 w-28 bg-white/20 rounded-full animate-pulse" />
                    <span className="h-px flex-1 bg-white/10" />
                </div>

                <div className="
                    flex flex-row flex-wrap sm:flex-nowrap flex-1 justify-between gap-3 sm:gap-6
                    backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-4 md:p-8
                ">
                    <div className="relative">
                        <div className="w-36 h-56 sm:w-54 sm:h-80 bg-white/15 rounded-xl animate-pulse" />
                        <div className="absolute -top-3 -left-3 h-6 w-20 bg-white/20 rounded-full animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3 sm:gap-6">
                        <div>
                            <div className="h-7 sm:h-10 w-3/4 bg-white/20 rounded-lg animate-pulse mb-3 sm:mb-4" />

                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="h-5 sm:h-6 w-16 sm:w-20 bg-white/15 rounded-full animate-pulse shrink-0" />
                                <div className="h-5 sm:h-6 w-14 sm:w-16 bg-white/15 rounded-full animate-pulse shrink-0" />
                                <div className="h-5 sm:h-6 w-12 sm:w-14 bg-white/15 rounded-full animate-pulse shrink-0" />
                                <div className="h-5 sm:h-6 w-14 sm:w-18 bg-white/15 rounded-full animate-pulse shrink-0" />
                            </div>

                            <div className="mb-3 flex flex-wrap gap-2">
                                <div className="h-5 sm:h-6 w-12 sm:w-14 bg-white/15 rounded-full animate-pulse" />
                                <div className="h-5 sm:h-6 w-14 sm:w-16 bg-white/15 rounded-full animate-pulse" />
                                <div className="h-5 sm:h-6 w-10 sm:w-12 bg-white/15 rounded-full animate-pulse" />
                                <div className="h-5 sm:h-6 w-14 sm:w-18 bg-white/15 rounded-full animate-pulse" />
                                <div className="h-5 sm:h-6 w-12 sm:w-14 bg-white/15 rounded-full animate-pulse" />
                            </div>

                            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-6">
                                <div className="h-3 w-full bg-white/15 rounded animate-pulse" />
                                <div className="h-3 w-11/12 bg-white/15 rounded animate-pulse" />
                                <div className="h-3 w-10/12 bg-white/15 rounded animate-pulse" />
                                <div className="h-3 w-8/12 bg-white/15 rounded animate-pulse" />
                            </div>

                            <div className="hidden sm:flex flex-row flex-nowrap items-center gap-2 sm:gap-3">
                                <div className="h-9 sm:h-10 flex-1 sm:flex-none w-24 sm:w-28 bg-white/20 rounded-md animate-pulse" />
                                <div className="h-9 sm:h-10 flex-1 sm:flex-none w-28 sm:w-44 bg-white/15 rounded-md animate-pulse" />
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-between gap-3 mt-3 sm:mt-4 w-full opacity-90">
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                                <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                                <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                                <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                            </div>
                            <div className="flex items-center gap-4 w-24 justify-end shrink-0">
                                <div className="h-10 w-10 bg-white/15 rounded-full animate-pulse" />
                                <div className="h-10 w-10 bg-white/15 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="flex sm:hidden basis-full items-center gap-2">
                        <div className="h-9 flex-1 bg-white/20 rounded-md animate-pulse" />
                        <div className="h-9 flex-1 bg-white/15 rounded-md animate-pulse" />
                    </div>
                    <div className="flex sm:hidden basis-full items-center justify-between gap-3 mt-1 w-full opacity-90">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                            <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                            <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                            <div className="h-2.5 w-2.5 bg-white/25 rounded-full animate-pulse" />
                        </div>
                        <div className="flex items-center gap-2 w-auto justify-end shrink-0">
                            <div className="h-8 w-8 bg-white/15 rounded-full animate-pulse" />
                            <div className="h-8 w-8 bg-white/15 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSkeleton;
