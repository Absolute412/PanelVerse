import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { AddButton } from "./AddButton";
import { useNavigate } from "react-router-dom";
import ChapterList from "./ChapterList";

const MangaModal = ({manga, onClose}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [onClose]);

  if (!manga) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

        {/* Overlay */}
        <div 
            className="absolute inset-0 bg-black/70 animate-fadeIn" 
            onClick={onClose} 
        />

        {/* Modal Box */}
        <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-lg p-6
                                    transform opacity-0 scale-95 translate-y-4 animate-modalIn
        ">

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
                <Icon 
                    icon="material-symbols:close-rounded"
                    className="text-2xl"
                />
            </button>

            {/* Content */}
            <div>
                <div className="flex gap-4">
                    <img 
                        src={manga.cover}
                        alt={manga.title} 
                        className="w-32 h-48 object-cover rounded"
                    />

                    <div className="flex flex-col flex-1">
                        
                            <h2 className="text-xl font-bold">{manga.title}</h2>
                            <p className="text-sm text-gray-500">{manga.author || "unknown"}</p>
                            <p className="mt-5 text-sm text-gray-700 line-clamp-3">{manga.description || "nothing here"}</p>
                        

                        <div className="mt-6 flex gap-3">
                            <button 
                                onClick={() => navigate(`/read/${manga.id}`)}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 
                                                            text-white text-sm font-medium rounded-md transition cursor-pointer"
                            >
                                Read
                            </button>
                            <AddButton manga={manga}/>
                        </div>
                    </div>
                </div>

                <ChapterList chapters={manga.chapters}/>
            </div>

        </div>
    </div>
  )
}

export default MangaModal