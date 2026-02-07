// src/pages/ChapterReader.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllChapters, getChapterPages } from "../api/manga";
import Navbar from "./Navbar";
import { Icon } from "@iconify/react";
import ScrollToTopBtn from "./ScrollToTopBtn";
import { getChapterLabel } from "../utils/formatChapter";

const ChapterReader = () => {
  const {mangaId, chapterId } = useParams(); // from route like /chapter/:id
  const navigate = useNavigate();
  const location = useLocation();

  const [chapters, setChapters] = useState(
    location.state?.chapters || []
  );
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (chapters.length > 0) return;

      getAllChapters(mangaId)
        .then(setChapters)
        .catch(() => setError("Faied to fetch chapters"));
  }, [chapters.length, mangaId]);

  useEffect(() => {
    let isMounted = true;

    const fetchManga = async () => {
        try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const data = await getChapterPages(chapterId);
        if (isMounted) setPages(data);
      } catch {
        if (isMounted) setError("Failed to load chapter pages");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchManga();

    return () => {
      isMounted = false;
    };
  }, [chapterId]);

  const currentIndex = chapters.findIndex(
    (ch) => ch.id === chapterId
  );

  const prevChapter = 
    currentIndex !== -1 ? chapters[currentIndex - 1] : null;

  const nextChapter = 
    currentIndex !== -1 ? chapters[currentIndex + 1] : null;

  const currentChapter = currentIndex !== -1 ? chapters[currentIndex] : null;
  const chapterLabel = currentChapter ? getChapterLabel(currentChapter) : "";

  const handleBack = () => {
    navigate(`/manga/${mangaId}`);
  }

  if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-main dark:bg-main-dark">
                <Icon icon="eos-icons:loading" className="text-6xl text-action dark:text-gray-600"/>
            </div>
        );
    }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col gap-2 items-center justify-center text-center py-6 text-red-500
                                 bg-main dark:bg-main-dark dark:text-red-600"
      >
        {error}

        <button 
          onClick={handleBack} 
          className="text-white dark:text-white px-2 py-2 bg-component dark:bg-component-dark hover:bg-blue-500 dark:hover:bg-component-hover-dark rounded-lg cursor-pointer"
        >
          Go back
        </button>
      </div>
    )
  }

  return (

    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 items-center pt-20 bg-main dark:bg-main-dark">
        <ScrollToTopBtn />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 w-full mb-4">
            <button 
              onClick={handleBack} 
              className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400 transition cursor-pointer"
              aria-label="Go back"
            >
              <Icon icon="eva:arrow-back-fill"/>
            </button>
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
              Chapter Reader
            </span>
            <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
          </div>
        </div>

        <div className="flex flex-col items-center bg-main dark:bg-main-dark min-h-screen py-6 gap-4">
          <h2 className="text-gray-800 dark:text-gray-200 font-semibold bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-full px-4 py-2 backdrop-blur-md shadow-2xl">
            {chapterLabel}
          </h2>

          {pages.length === 0 && !loading && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              This chapter has no pages available.
            </p>
          )}

          {pages.map((page, i) => (
            <img
              key={i}
              src={page.image}
              alt={`Page ${i + 1}`}
              className="w-full max-w-3xl rounded-lg shadow-lg"
              loading="lazy"
            />
          ))}

          <div className="fixed bottom-4 left-4 flex gap-4 z-50 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-full px-4 py-2 backdrop-blur-md shadow-2xl">
            <button 
              disabled={!prevChapter}
              onClick={() => 
                navigate(`/read/${mangaId}/${prevChapter.id}`, {
                  state: {chapters},
                })
              }
              className={`transition ${
                prevChapter
                  ? "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Prev
            </button>
            
            <button 
              disabled={!nextChapter}
              onClick={() => 
                navigate(`/read/${mangaId}/${nextChapter.id}`, {
                  state: {chapters},
                })
              }
              className={`transition ${
                nextChapter
                  ? "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterReader;
