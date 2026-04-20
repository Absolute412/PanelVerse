import { useLibrary } from "../contexts/LibraryContext";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { getLibrarySortPreference, getMangaProgress } from "../utils/storageService";

function Library() {
    const {library} = useLibrary();
    const sortPreference = getLibrarySortPreference();

    const sortedLibrary = useMemo(() => {
        if (!Array.isArray(library)) return [];

        if (sortPreference === "alphabetical") {
            return [...library].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }

        if (sortPreference === "recently-read") {
            return [...library].sort((a, b) => {
                const aUpdatedAt = getMangaProgress(a.id)?.updatedAt || 0;
                const bUpdatedAt = getMangaProgress(b.id)?.updatedAt || 0;
                return bUpdatedAt - aUpdatedAt;
            });
        }

        // Default: recently added first using insertion order.
        return [...library].reverse();
    }, [library, sortPreference]);

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
                    </div>
                </div>

                {library.length === 0 ? (
                    <p className="text-(--text-muted) text-sm mt-4">
                        Your library is empty. Add some manga to see them here.
                    </p>
                ) : (
                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {sortedLibrary.map((manga) => (
                            <Link key={manga.id} to={`/manga/${manga.id}`}>
                                <Card manga={manga} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Library
