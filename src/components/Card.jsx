import { useMemo, useState } from "react";
import { useLibrary } from "../contexts/LibraryContext";
import { Icon } from "@iconify/react";

const Card = ({ variant = "feed", manga, onClick, }) => {
    const { library, addToLibrary, removeFromLibrary } = useLibrary();
    const [imageIndex, setImageIndex] = useState(0);

    const isInLibrary = useMemo(() =>
        library.some(item => item.id === manga.id), [library, manga.id]
    );

    const imageCandidates = useMemo(() => 
        [manga.imageFull, manga.imageThumb, manga.imageMedium, "/placeholder.jpg"].filter(Boolean),
        [manga.imageFull, manga.imageThumb, manga.imageMedium]
    );

    if(!manga) return null;

    const handleImageError = () => {
        setImageIndex((prev) => (prev < imageCandidates.length - 1 ? prev + 1 : prev));
    };

    if (variant === "feed") {
        return (
            <div 
                onClick={(e) => {
                    // Ignore if click came from a button
                    if (e.target.closest("button")) return;
                    onClick?.(e);
                }}
                className="
                group flex-none w-full bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
                rounded-2xl shadow-2xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden
                transition-transform duration-300 backdrop-blur-md"
            >
                <div className="relative">
                    {/* Thumbnail */}
                    <img 
                        src={imageCandidates[imageIndex]}
                        onError={handleImageError}
                        className="w-full h-54 sm:h-80 object-cover"
                        loading="lazy"
                        alt={manga.title || "Manga cover"}
                    />

                    {/* Badge - "In library" text top left */}
                    {isInLibrary && (
                        <div 
                            className="
                            absolute top-2 left-2 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-100"
                        >
                            <span 
                                className="text-[10px] font-semibold px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white"
                            >
                                In library
                            </span>
                        </div>
                    )}

                    {/* Persistent Badge - Bookmark icon top right */}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            isInLibrary ? removeFromLibrary(manga.id) : addToLibrary(manga);
                        }}
                        className={`
                            absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60
                            transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer
                            ${isInLibrary ? "opacity-100" : "opacity-60 group-hover:opacity-100"}
                        `}
                    >
                        <Icon 
                            icon={isInLibrary ? "mdi:bookmark" : "mdi:bookmark-outline"} 
                            className="text-(--action) text-xl transition-transform duration-200" 
                        />
                    </button>

                    {/* Overlay only shows when manga in library */}
                    <div 
                        className={`absolute inset-0 transition-opacity 
                            ${isInLibrary 
                                ? "opacity-80 bg-black/40 hover:bg-black/50"  
                                : "opacity-0 group-hover:opacity-100"
                        }`} 
                    />

                    <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                {/* Manga title */}
                <div className="p-2 sm:p-4 flex items-center">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-(--text-main) truncate" title={manga.title}>
                            {manga.title || "Unknown title"}
                        </h3>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <div 
        onClick={onClick}
        className="
            flex-none w-full bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
            rounded-2xl shadow-2xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden
            transition-transform duration-300 backdrop-blur-md
        "
    >
        <div className="relative">
            {/* Thumbnail */}
            <img 
                src={imageCandidates[imageIndex]}
                onError={handleImageError}
                className="w-full h-54 sm:h-80 object-cover"
                loading="lazy"
                alt={manga.title || "Manga cover"}
            />

            <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Manga title */}
        <div className="p-2 sm:p-4 flex items-center">
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-(--text-main) truncate">
                    {manga.title || "Unknown title"}
                </h3>
            </div>
        </div>
    </div>
  );
}

export default Card
