import { AddButton } from "./AddButton";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import ChapterList from "./ChapterList";
import { useEffect, useState } from "react";
import { getAllChapters, getManga } from "../api/manga";

const MangaPage = () => {
    const navigate = useNavigate();
    const { mangaId } = useParams();

    const [open, setOpen] = useState(false);
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState([]);
    const [chaptersLoading, setChaptersLoading] = useState(true);

    useEffect(() => {
        if (!mangaId) return;

        getManga(mangaId)
            .then(setManga)
            .catch(() => setManga(null))
            .finally(() => setLoading(false));
    }, [mangaId]);

    useEffect(() => {
        if (!mangaId) return;

        setChaptersLoading(true);
        getAllChapters(mangaId)
        .then((data) => {
            const sortedChapters = [...data].sort((a, b) => {
                const na = parseFloat(a.number);
                const nb = parseFloat(b.number);

                if (isNaN(na) && isNaN(nb)) return 0;
                if (isNaN(na)) return 1;
                if (isNaN(nb)) return -1;

                return na - nb;
            });
            setChapters(sortedChapters);
            console.log("Fetched chapters:", data);
        })
        .catch(console.error)
        .finally(() => setChaptersLoading(false));
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


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-main dark:bg-main-dark">
                <Icon icon="eos-icons:loading" className="text-6xl text-action dark:text-gray-600"/>
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center dark:bg-main-dark">
                <p className="text-gray-600 dark:text-white">Manga not found</p>
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
    <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
        <Navbar />
        <div className="flex-1">
            <div className="pt-20 pb-16 px-4 sm:px-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 w-full mb-4">
                        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                            Manga Details
                        </span>
                        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                    </div>

                    <div className="flex flex-row gap-3 sm:gap-4 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-md shadow-2xl p-4 sm:p-6 ">
                        <div
                            className="relative group cursor-pointer overflow-hidden rounded-lg w-32 h-56 sm:w-42 sm:h-auto shrink-0 self-start sm:self-auto sm:mx-0"
                            onClick={() => setOpen(true)}
                        >
                            <img 
                                src={manga.imageThumb}
                                alt={manga.title} 
                                className="w-full h-full sm:h-60 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                                <Icon 
                                    icon="humbleicons:expand"
                                    className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col h-56 sm:h-60 min-w-0 flex-1">                        
                            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-2 text-gray-800 dark:text-white">
                                {manga.title}
                            </h2>

                            <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[12px] font-semibold text-black/70 dark:text-white/70 mb-3 overflow-x-auto custom-scrollbar">
                                <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 dark:bg-white/10 flex items-center gap-1 whitespace-nowrap">
                                    <Icon icon="mdi:account-outline" className="text-sm"/>
                                    {manga.author || "unknown"}
                                </span>
                                {manga.status && (
                                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 dark:bg-white/10 whitespace-nowrap">
                                        {manga.status}
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 flex-1 overflow-y-auto pr-2 text-sm sm:text-base text-gray-800/90 dark:text-gray-100/90 custom-scrollbar min-h-0 max-h-24 sm:max-h-40 md:max-h-none">
                                {manga.description || "No description available."}
                            </p>

                            <div className="mt-3 flex sm:hidden flex-row gap-2">
                                <Link 
                                    to={chapters.length > 0 ? `/read/${mangaId}/${chapters[0].id}` : "#"}
                                    state={{ chapters, mangaId }}
                                    className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-md transition
                                        ${chapters.length === 0
                                            ? "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed pointer-events-none"
                                            : "bg-action hover:bg-action-hover dark:bg-action-dark dark:hover:bg-action-dark-hover text-white cursor-pointer"
                                        }
                                    `}
                                >
                                    Read
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <AddButton manga={manga} className="w-full justify-center text-sm"/>
                                </div>
                            </div>

                            <div className="hidden sm:flex mt-4 flex-row gap-3">
                                <Link 
                                    to={chapters.length > 0 ? `/read/${mangaId}/${chapters[0].id}` : "#"}
                                    state={{ chapters, mangaId }}
                                    className={`flex-none text-center px-4 py-2 text-sm font-medium rounded-md transition
                                        ${chapters.length === 0
                                            ? "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed pointer-events-none"
                                            : "bg-action hover:bg-action-hover dark:bg-action-dark dark:hover:bg-action-dark-hover text-white cursor-pointer"
                                        }
                                    `}
                                >
                                    Read
                                </Link>

                                <div className="flex-none">
                                    <AddButton manga={manga}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {manga.genres && manga.genres.length > 0 ? (
                                manga.genres.map((genre, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-black/10 dark:bg-white/10 text-black dark:text-gray-200 text-[10px] font-black px-3 py-1 rounded-full">
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
                
                
                <ChapterList 
                    chapters={[...chapters].reverse()}
                    loading={chaptersLoading}
                    onChapterClick={(chapterId) =>
                        navigate(`/read/${manga.id}/${chapterId}`)
                    }
                />
            </div>
        </div>

        {open && (
            <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                onClick={() => setOpen(false)}
            >
                {/* Stop click bubbling */}
                <div
                    className="relative max-w-5xl max-h-[90vh] flex items-center justify-center pointer-events-auto"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={manga.imageFull}
                        alt={manga.title}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />

                    {/* Close button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute -top-4 -right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full"
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
        <Footer />
    </div>
  )
}

export default MangaPage
