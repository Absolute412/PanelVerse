import { useLibrary } from "../contexts/LibraryContext";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getLibrarySortPreference, getMangaProgress, setLibrarySortPreference } from "../utils/storageService";
import FilterMenu from "../components/FilterMenu";

function Library() {
    const {library} = useLibrary();
    const [sortBy, setSortBy] = useState(() => getLibrarySortPreference());
    const [filters, setFilters] = useState({
        query: "",
        progress: "all",
    });

    useEffect(() => {
        setLibrarySortPreference(sortBy);
    }, [sortBy]);

    const filteredLibrary = useMemo(() => {
        if (!Array.isArray(library)) return [];

        const normalizedQuery = filters.query.trim().toLowerCase();

        const getProgressStatus = (mangaId) => {
            const progress = getMangaProgress(mangaId);

            const chapters = progress.chapters || {};
            const chapterList = Object.values(chapters);

            if (chapterList.length === 0) return "unread";

            const allCompleted = chapterList.every((ch) => ch.completed);
            const anyStarted = chapterList.some((ch) => ch.lastPage > 0 || ch.completed);

            if (allCompleted) return "completed";
            if (anyStarted) return "in-progress";

            return "unread";
        };

        const byFilter = library.filter((manga) => {
            const title = (manga.title || "").toLowerCase();
            const author = (manga.author || "").toLowerCase();
            const matchesQuery =
                !normalizedQuery || title.includes(normalizedQuery) || author.includes(normalizedQuery);

            if (!matchesQuery) return false;
            if (filters.progress === "all") return true;

            return getProgressStatus(manga.id) === filters.progress;
        });

        if (sortBy === "alphabetical") {
            return [...byFilter].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }

        if (sortBy === "recently-read") {
            return [...byFilter].sort((a, b) => {
                const aUpdatedAt = getMangaProgress(a.id)?.updatedAt || 0;
                const bUpdatedAt = getMangaProgress(b.id)?.updatedAt || 0;
                return bUpdatedAt - aUpdatedAt;
            });
        }

        // Default: recently added first using insertion order.
        return [...byFilter].reverse();
    }, [library, filters, sortBy]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.query.trim()) count += 1;
        if (filters.progress !== "all") count += 1;
        if (sortBy !== "recently-added") count += 1;
        return count;
    }, [filters, sortBy]);

    return(
        <div className="flex-1">
            <div className="pt-20 pb-16 px-4 sm:px-6">
                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex flex-col ">
                            <span className="text-[15px] font-black tracking-[0.2em] uppercase text-(--text-main)/70">
                                Library
                            </span>
                            <span className="text-[12px] text-(--text-muted) font-light tracking-[0.2em] ">Your saved and downloaded manga</span>
                        </div>
                        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                        <FilterMenu
                            filters={filters}
                            setFilters={setFilters}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            activeCount={activeFilterCount}
                            resultCount={filteredLibrary.length}
                            totalCount={library.length}
                        />
                    </div>
                </div>

                {library.length === 0 ? (
                    <p className="text-(--text-muted) text-center text-sm mt-10">
                        Your library is empty. Add some manga to see them here.
                    </p>
                ) : filteredLibrary.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-black/20 dark:border-white/20 bg-(--component)/40 p-6">
                        <p className="text-(--text-main) font-semibold">No matching titles</p>
                        <p className="text-(--text-muted) text-sm mt-1">
                            Try adjusting your search text or reading status filter.
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredLibrary.map((manga) => (
                            <Link 
                                key={manga.id} 
                                to={`/manga/${manga.id}`}
                            >
                                <Card manga={manga} variant="library" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Library
