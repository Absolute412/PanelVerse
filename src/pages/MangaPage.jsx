import { AddButton } from "../components/AddButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import ChapterList from "../components/ChapterList";
import { useEffect, useState } from "react";
import { getAllChapters, getManga } from "../api/manga";
import { getMangaProgress, setMangaProgress } from "../utils/storageService";

const getChapterNumericValue = (chapter) => {
    const fromNumber = parseFloat(chapter?.number);
    if (!Number.isNaN(fromNumber)) return fromNumber;

    const title = String(chapter?.title || "");
    const match = title.match(/chapter\s*([\d.]+)/i) || title.match(/(\d+(?:\.\d+)?)/);
    if (!match) return Number.NEGATIVE_INFINITY;

    const fromTitle = parseFloat(match[1]);
    return Number.isNaN(fromTitle) ? Number.NEGATIVE_INFINITY : fromTitle;
};

const getDefaultStartChapterId = (chapterList) => {
    if (!chapterList.length) return null;

    // Prefer the earliest numeric chapter when available.
    const numeric = chapterList
        .map((ch) => ({ id: ch.id, value: getChapterNumericValue(ch) }))
        .filter((item) => Number.isFinite(item.value));

    if (numeric.length > 0) {
        numeric.sort((a, b) => a.value - b.value);
        return numeric[0].id;
    }

    // Fallback when every chapter number is missing: start from the end of the fetched list.
    return chapterList[chapterList.length - 1]?.id || chapterList[0]?.id || null;
};

const MangaPage = () => {
    const navigate = useNavigate();
    const { mangaId } = useParams();

    const [open, setOpen] = useState(false);
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState([]);
    const [chaptersLoading, setChaptersLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const status = manga?.status.trim().toLowerCase();

    useEffect(() => {
        if (!mangaId) return;

        getManga(mangaId)
            .then(setManga)
            .catch(() => setManga(null))
            .finally(() => setLoading(false));
    }, [mangaId]);

    useEffect(() => {
        if (!mangaId) return;

        let isMounted = true;

        const loadChapters = async () => {
            setChaptersLoading(true);

            try {
                const data = await getAllChapters(mangaId);

                if (!isMounted) return;
                // Sort chapter numbers numerically while keeping non-numeric labels at the end.
                const sortedChapters = [...data].sort((a, b) => {
                    const na = parseFloat(a.number);
                    const nb = parseFloat(b.number);

                    if (isNaN(na) && isNaN(nb)) return 0;
                    if (isNaN(na)) return 1;
                    if (isNaN(nb)) return -1;

                    return na - nb;
                });

                setChapters(sortedChapters);
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setChaptersLoading(false);
            }
        };

        loadChapters();

        return () => { isMounted = false; };
    
    }, [mangaId]);

    useEffect(() => {
        if (!open) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        if (!manga?.imageFull) return;
        const img = new Image();
        img.src = manga.imageFull;
    }, [manga]);

    useEffect(() => {
        if (!mangaId || !manga) return;

        // Backfill progress metadata so Continue Reading can render non-library manga cards.
        const progress = getMangaProgress(mangaId);
        const nextTitle = manga.title || null;
        const nextThumb = manga.imageThumb || "/placeholder.jpg";
        const nextMedium = manga.imageMedium || manga.imageThumb || "/placeholder.jpg";

        const sameTitle = (progress?.title || null) === nextTitle;
        const sameThumb = (progress?.imageThumb || "/placeholder.jpg") === nextThumb;
        const sameMedium = (progress?.imageMedium || "/placeholder.jpg") === nextMedium;
        if (sameTitle && sameThumb && sameMedium) return;

        setMangaProgress(mangaId, {
            ...progress,
            title: nextTitle,
            imageThumb: nextThumb,
            imageMedium: nextMedium,
        });
    }, [mangaId, manga]);

    const getReadingProgress = () => {
        const progress = getMangaProgress(mangaId);
        return {
            currentChapterId: progress.currentChapterId,
            chapters: progress.chapters || {},
        };
    };

    const getResumeChapterId = () => {
        if (!chapters.length) return null;

        const defaultChapterId = getDefaultStartChapterId(chapters);
        const readingProgress = getReadingProgress();
        const savedChapterId = readingProgress.currentChapterId;
        const chapterExists = chapters.some((ch) => ch.id === savedChapterId);

        return chapterExists ? savedChapterId : defaultChapterId;
    };

    const readingProgress = getReadingProgress();
    const resumeChapterId = getResumeChapterId();
    const displayChapters = [...chapters].sort((a, b) => {
        const na = getChapterNumericValue(a);
        const nb = getChapterNumericValue(b);

        if (na === nb) {
            return String(b?.title || "").localeCompare(String(a?.title || ""));
        }

        return nb - na;
    });

    // Pass manga metadata through route state so reader can persist it with progress updates.
    const readingState = manga
        ? {
            chapters,
            mangaId,
            manga: {
                title: manga.title,
                imageThumb: manga.imageThumb,
                imageMedium: manga.imageMedium,
            },
        }
        : { chapters, mangaId };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-(--action-hover) border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-(--main)">
                <p className="text-(--text-main)">Manga not found</p>
                <button 
                    onClick={() => navigate(-1)} 
                    className="mt-4 text-blue-500 cursor-pointer"
                >
                    Go back
                </button>
            </div>
        )
    }

  return (
    <>
        <div className="flex-1">
            <div className="pt-20 px-4 sm:px-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 w-full mb-4">
                        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-(--text-main)/70">
                            Manga Details
                        </span>
                        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                    </div>

                    <div 
                        className="
                        flex flex-col gap-1 bg-white/35 dark:bg-black/30 border 
                        border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-md shadow-2xl p-4 sm:p-6 "
                    >
                        {/* ROW: Thumbnail, title, meta and chapters count */}
                        <div className="flex flex-row gap-4">
                            <div
                                className="
                                relative group cursor-pointer overflow-hidden rounded-lg 
                                w-32 h-full sm:w-42 sm:h-auto shrink-0 self-start sm:self-auto sm:mx-0"
                                onClick={() => setOpen(true)}
                            >
                                {/* Thumbnail */}
                                <img 
                                    src={manga.imageFull}
                                    alt={manga.title} 
                                    className="
                                    w-full h-full sm:h-60 object-cover rounded 
                                    transition-transform duration-300 group-hover:scale-105"
                                />

                                <div 
                                    className="
                                    absolute inset-0 bg-black/0 group-hover:bg-black/60 
                                    transition-colors duration-300 flex items-center justify-center"
                                >
                                    <Icon 
                                        icon="humbleicons:expand"
                                        className="
                                        text-white text-4xl opacity-0 
                                        group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                </div>
                            </div>

                            {/* Manga title, author, status */}
                            <div className="flex flex-col sm:h-60 min-w-0 flex-1">
                                <h2 
                                    className="
                                    text-base sm:text-5xl font-extrabold tracking-tight 
                                    mb-2 text-(--text-main) sm:line-clamp-3 wrap-break-word"
                                    title={manga.title}
                                >
                                    {manga.title}
                                </h2>

                                <div 
                                    className="
                                    flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] 
                                    sm:text-[12px] font-semibold text-(--text-main)/70 mb-3"
                                >
                                    <span 
                                        className="
                                        px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 
                                        dark:bg-white/10 flex items-center gap-1 whitespace-nowrap"
                                    >
                                        <Icon icon="mdi:account-outline" className="text-sm"/>
                                        {manga.author || "unknown"}
                                    </span>
                                    {manga.status && (
                                        <div 
                                            className="
                                            flex items-center gap-2 px-2 py-0.5 sm:px-3 sm:py-1 
                                            rounded-full bg-black/5 dark:bg-white/10"
                                        >
                                            <div 
                                                className={`h-1.5 w-1.5 rounded-full
                                                    ${status === "completed"
                                                        ? "bg-blue-500"
                                                        : status === "ongoing"
                                                        ? "bg-green-500"
                                                        : status === "hiatus"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                    }
                                                `} />
                                            <div>{manga.status}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Chapter count */}
                                <div className="mt-auto">
                                    <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                    <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-medium text-(--text-main)/60">
                                        <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                                            {chaptersLoading ? "Loading chapters..." : `${chapters.length} chapters`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Single responsive action row for both mobile and desktop. */}
                        <div className="mt-3 sm:mt-4 flex flex-row gap-2 sm:gap-3">
                            <Link 
                                to={resumeChapterId ? `/read/${mangaId}/${resumeChapterId}` : "#"}
                                state={{
                                    ...readingState, 
                                    from: "mangaPage"
                                }}
                                className={`
                                    flex-1 sm:flex-none text-center px-2 py-1 sm:px-4 
                                    sm:py-2 text-sm font-medium rounded-md transition
                                    ${chapters.length === 0
                                        ? "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed pointer-events-none"
                                        : "bg-(--action) hover:bg-(--action-hover) text-white cursor-pointer"
                                    }
                                `}
                            >
                                Read
                            </Link>

                            <div className="flex-1 sm:flex-none min-w-0">
                                <AddButton 
                                    manga={manga} 
                                    className="w-full sm:w-auto justify-center text-sm"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="overflow-hidden">
                            <div className="relative overflow-hidden">
                                <p 
                                    className={`
                                        mt-1 text-sm sm:text-base leading-relaxed text-(--text-muted) transition-[max-height]
                                        ${expanded 
                                            ? "max-h-75 duration-200 ease-out" 
                                            : "max-h-18 overflow-hidden duration-200 ease-in"
                                        }
                                    `}
                                >
                                    {manga.description || "No description available."}
                                </p>

                                {/* Fade effect */}
                                {!expanded && (
                                    <div
                                        className="
                                        pointer-events-none absolute inset-x-0 bottom-0 h-12
                                        bg-linear-to-t from-(--main)/35 dark:from-(--main)/30 to-transparent"
                                    />
                                )}
                            </div>

                            <button
                                onClick={() => setExpanded(prev => !prev)}
                                className="
                                mt-2 mx-auto flex items-center justify-center p-2 rounded-full bg-(--component)/60 hover:bg-(--component) 
                                transition duration-300 cursor-pointer text-lg"
                            >
                                <Icon 
                                    icon={expanded ? "mdi:keyboard-arrow-up" : "mdi:keyboard-arrow-down"} 
                                    className="transition-transform duration-300 "
                                />
                            </button>
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="mt-4">
                        <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden custom-scrollbar">
                            {manga.genres && manga.genres.length > 0 ? (
                                manga.genres.map((genre, index) => (
                                    <span 
                                        key={index} 
                                        className="
                                        bg-black/10 dark:bg-white/10 text-(--text-main)
                                        text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shrink-0"
                                    >
                                        {genre}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No genres available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Chapterlist */}
                <ChapterList 
                    chapters={displayChapters}
                    loading={chaptersLoading}
                    currentChapterId={readingProgress.currentChapterId}
                    chapterProgress={readingProgress.chapters}
                    onChapterClick={(chapterId) =>
                        navigate(`/read/${manga.id}/${chapterId}`, {
                            state: {
                                ...readingState,
                                from: "mangaPage"
                            }
                        })
                    }
                />
            </div>
        </div>

        {/* Thumbnail modal */}
        {open && (
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                onClick={() => setOpen(false)}
            >
                {/* Stop click bubbling */}
                <div
                    className="
                    relative w-[85vw] max-w-[85vw] max-h-[70vh] sm:w-auto sm:max-w-5xl 
                    sm:max-h-[90vh] flex items-center justify-center pointer-events-auto"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={manga.imageFull}
                        alt={manga.title}
                        className="max-w-full max-h-[70vh] sm:max-h-[90vh] object-contain rounded-lg"
                    />

                    {/* Close button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="
                        absolute top-2 right-2 sm:-top-4 sm:-right-4 bg-black/70 hover:bg-black 
                        text-white p-2 rounded-full cursor-pointer"
                        aria-label="Close image"
                    >
                        <Icon 
                            icon="material-symbols:close-rounded"
                            className="text-2xl"
                        />
                    </button>
                </div>
            </div>
        )}
    </>
  )
}

export default MangaPage
