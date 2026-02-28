import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { mangaApi } from "../api";
import { Icon } from "@iconify/react";
import { useLibrary } from "../contexts/LibraryContext";
import HeroSkeleton from "./HeroSkeleton";

function Hero() {
    const [mangas, setMangas] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const {addToLibrary, removeFromLibrary, library} = useLibrary();

    const intervalRef = useRef(null);
    const HERO_LIMIT = 10;

    const nextSlide = () => {
        setActiveIndex(prev =>
            prev === mangas.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setActiveIndex(prev =>
            prev === 0 ? mangas.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const data = await mangaApi.getPopularManga(HERO_LIMIT);
                setMangas(data);
            } catch (err) {
                console.error("Error fetching manga:", err);
            }
        };

        fetchManga();
    }, []);

    useEffect(() => {
        if (!mangas.length) return;

        intervalRef.current = setInterval(nextSlide, 7000);
        return () => clearInterval(intervalRef.current);
    }, [mangas]);

    if (!mangas.length) {
        return <HeroSkeleton />;
    }

    const activeManga = mangas[activeIndex];
    const isInLibrary = library.some(item => item.id === activeManga.id);


    const handleNext = () => {
        clearInterval(intervalRef.current);
        nextSlide();
        intervalRef.current = setInterval(nextSlide, 7000);
    };

    const handlePrev = () => {
        clearInterval(intervalRef.current);
        prevSlide();
        intervalRef.current = setInterval(nextSlide, 7000);
    };

    return (
        <section className="relative bg-main dark:bg-main-dark min-h-[calc(58vh-4rem)] sm:min-h-[calc(80vh-4rem)] flex items-start sm:items-center overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src={activeManga.imageMedium}
                    alt={activeManga.title} 
                    className="absolute inset-0 w-full h-full object-cover bg-center opacity-45 scale-105 transition-opacity duration-700"
                />

                {/* Atmospheric overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/25 to-transparent" />

                {/* Bottom fade */}
                <div 
                    className="
                        absolute bottom-0 left-0 w-full h-40 bg-linear-to-t
                        from-main dark:from-main-dark via-transparent
                    " 
                />
            </div>

            <div className="flex flex-col px-4 pt-2 sm:pt-0 gap-3 sm:gap-4 z-10 w-full">
                <div className="flex items-center gap-3 mt-1 sm:mt-4">
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                        Popular Manga
                    </span>
                    <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                </div>
                {/* Content */}
                <div className="
                    flex flex-col gap-3 sm:gap-4 bg-white/35 dark:bg-black/30 border border-white/20
                    dark:border-white/10 rounded-2xl backdrop-blur-md shadow-2xl p-4 sm:p-6
                ">
                    
                    <div className="flex flex-row gap-3 sm:gap-4">
                        <div className="relative w-32 h-56 sm:w-42 sm:h-auto shrink-0 self-start sm:self-auto sm:mx-0">
                            <img
                                src={activeManga.imageMedium}
                                alt={activeManga.title}
                                className="w-full h-full sm:h-60 object-cover rounded-lg opacity-95 shadow-2xl ring-1 ring-white/40 dark:ring-white/15"
                            />
                            <div className="
                                absolute -top-3 -left-3 bg-hero-action dark:bg-action-dark text-gray-100
                                text-[10px] font-black px-3 py-1 rounded-full shadow-lg
                            ">
                                Trending
                            </div>
                        </div>

                        <div className="flex flex-col h-56 sm:h-60 min-w-0 flex-1">
                            <h1 className="text-base sm:text-3xl font-extrabold tracking-tight mb-2 text-gray-800 dark:text-white line-clamp-1">
                                {activeManga.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[12px] font-semibold text-black/70 dark:text-white/70 mb-3">
                                {activeManga.author && (
                                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 dark:bg-white/10 whitespace-nowrap">
                                        {activeManga.author}
                                    </span>
                                )}
                                {activeManga.status && (
                                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 dark:bg-white/10 whitespace-nowrap">
                                        {activeManga.status}
                                    </span>
                                )}
                                {activeManga.year && (
                                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 dark:bg-white/10 whitespace-nowrap">
                                        {activeManga.year}
                                    </span>
                                )}
                                {activeManga.rating && (
                                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 dark:bg-white/10 flex items-center gap-1 whitespace-nowrap">
                                        <Icon icon="ic:round-star" />
                                        {activeManga.rating}
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 flex-1 overflow-y-auto overflow-x-hidden wrap-break-word pr-1 sm:pr-2 text-sm sm:text-base text-gray-800/90 dark:text-gray-100/90 custom-scrollbar min-h-0 max-h-24 sm:max-h-40 md:max-h-none ">
                                {activeManga.description || "No description available."}
                            </p>

                            <div className="hidden sm:flex mt-3 sm:mt-4 flex-row gap-2 sm:gap-3">
                                <Link
                                    to={`/manga/${activeManga.id}`}
                                    className="
                                        flex-1 sm:flex-none text-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-medium rounded-md transition
                                        bg-hero-action hover:bg-hero-action-hover dark:bg-action-dark dark:hover:bg-action-dark-hover text-white cursor-pointer
                                    "
                                >
                                    Read Now
                                </Link>
                                <button
                                    onClick={() =>
                                        isInLibrary ? removeFromLibrary(activeManga.id) : addToLibrary(activeManga)
                                    }
                                    className="
                                        flex-1 sm:flex-none min-w-0 justify-center px-2 py-1 sm:px-4 sm:py-2 text-sm rounded-md font-medium
                                        bg-black/10 dark:bg-white/10 text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/20
                                        flex items-center gap-2 cursor-pointer
                                    "
                                >
                                    <Icon icon={isInLibrary ? "ic:round-bookmark-remove" : "ic:round-bookmark-add"} />
                                    <span className="hidden sm:inline">{isInLibrary ? "Remove from Library" : "Add to Library"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Genres inside glass card */}
                    <div className="mt-1">
                        <div className="flex flex-wrap gap-2">
                            {activeManga.genres?.slice(0, 6).map((genre, i) => (
                                <span
                                    key={i}
                                    className="bg-black/10 dark:bg-white/10 text-black dark:text-gray-200 text-[10px] font-black px-3 py-1 rounded-full"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="hidden sm:flex items-center justify-between gap-3 mt-1 w-full opacity-90 text-black dark:text-white">
                        <div className="flex items-center gap-2 shrink-0">
                            {mangas.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                                        i === activeIndex
                                            ? "bg-hero-action dark:bg-action-dark scale-110"
                                            : "bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50"
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-4 w-24 justify-end shrink-0">
                            <button onClick={handlePrev} className="p-3 hover:bg-gray-200/60 dark:hover:bg-gray-500/40 cursor-pointer rounded-full">
                                <Icon icon="ooui:next-rtl" />
                            </button>
                            <button onClick={handleNext} className="p-3 hover:bg-gray-200/60 dark:hover:bg-gray-500/40 cursor-pointer rounded-full">
                                <Icon icon="ooui:next-ltr" />
                            </button>
                        </div>
                    </div>
                    <div className="flex sm:hidden basis-full items-center gap-2">
                        <Link
                            to={`/manga/${activeManga.id}`}
                            className="
                                flex-1 text-center whitespace-nowrap px-4 py-2 text-sm bg-hero-action hover:bg-hero-action-hover dark:bg-action-dark
                                dark:hover:bg-action-dark-hover text-gray-100 dark:text-white rounded-md font-semibold
                            "
                        >
                            Read Now
                        </Link>
                        <button 
                            onClick={() => 
                                isInLibrary ? removeFromLibrary(activeManga.id) : addToLibrary(activeManga)
                            }
                            className="
                                flex-1 min-w-0 justify-center px-4 py-2 text-sm rounded-md font-semibold bg-black/10 dark:bg-white/10 text-black 
                                dark:text-white hover:bg-black/20 dark:hover:bg-white/20 flex items-center gap-2 cursor-pointer whitespace-nowrap
                            "
                        >
                            <Icon icon={isInLibrary ?  "ic:round-bookmark-remove" : "ic:round-bookmark-add"} />
                            <span>{isInLibrary ? "Remove" : "Add"}</span>
                        </button>
                    </div>
                    <div className="flex sm:hidden basis-full items-center justify-between gap-3 mt-1 w-full opacity-90 text-black dark:text-white">
                        <div className="flex items-center gap-2 shrink-0">
                            {mangas.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                                        i === activeIndex
                                            ? "bg-hero-action dark:bg-action-dark scale-110"
                                            : "bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50"
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-2 w-auto justify-end shrink-0">
                            <button onClick={handlePrev} className="p-2 hover:bg-gray-200/60 dark:hover:bg-gray-500/40 cursor-pointer rounded-full">
                                <Icon icon="ooui:next-rtl" />
                            </button>
                            <button onClick={handleNext} className="p-2 hover:bg-gray-200/60 dark:hover:bg-gray-500/40 cursor-pointer rounded-full">
                                <Icon icon="ooui:next-ltr" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </section>

    );
}

export default Hero;
