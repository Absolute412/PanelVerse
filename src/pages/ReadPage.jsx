import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ShowUIBar from "../components/ShowUIBar";
import ReaderSettingsModal from "../components/ReaderSettingsModal";
import { useMangaProgress } from "../hooks/useMangaProgress";
import { useReaderSettings } from "../hooks/useReaderSettings";
import { useChapterPages } from "../hooks/useChapterPages";
import { useChapters } from "../hooks/useChapters";
import { useChapterNavigation } from "../hooks/useChapterNavigation";

const ReadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mangaId, chapterId } = useParams();
  const { pages, loading, error } = useChapterPages(chapterId);
  const { chapters } = useChapters(
    mangaId,
    location.state?.chapters || []
  );
  const {
    prevChapter,
    nextChapter,
    chapterLabel,
    goNextChapter,
    goPrevChapter,
  } = useChapterNavigation({
    mangaId,
    chapterId,
    chapters,
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [loadedPages, setLoadedPages] = useState({});

  const [showUi, setShowUi] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pageMeta, setPageMeta] = useState({});
  const pageRefs = useRef([]);

  const mangaMeta = location.state?.manga || null;

  const preloadedRef = useRef(new Set());

  const {
    readingMode,
    setReadingMode,
    displayMode,
    setDisplayMode,
    direction,
    setDirection,
    backgroundColors,
    setBackgroundColors,
    progressBar,
    setProgressBar,
    progressBarPosition,
    setProgressBarPosition
  } = useReaderSettings();

  const scrollToPage = useCallback(
    (idx, behavior = "smooth") => {
      if (idx < 0 || idx >= pages.length) return false;

      if (readingMode === "single") {
        setActiveIdx(idx);
        return true;
      }

      const target = pageRefs.current[idx];
      if (target) {
        target.scrollIntoView({ behavior, block: "start" });
      } else {
        setActiveIdx(idx);
      }
      return true;
    },
    [pages.length, readingMode]
  );

  const handleImageLoad = useCallback((idx, e) => {
    if (!e?.target) return;

    const img = e.target;

    setLoadedPages((prev) => ({
      ...prev,
      [idx]: true,
    }));

    setPageMeta((prev) => ({
      ...prev,
      [idx]: {
        isWide: img.naturalWidth / img.naturalHeight > 1.2,
      },
    }));
  }, []);

  useMangaProgress({
    mangaId,
    chapterId,
    pages,
    activeIdx,
    mangaMeta,
    scrollToPage,
  });

  const goNext = useCallback(() => {
    if (!pages.length) return;

    const delta = direction === "rtl" ? -1 : 1;
    const nextIdx = activeIdx + delta;

    if (!scrollToPage(nextIdx)) {
      goNextChapter();
    }
  }, [pages.length, direction, activeIdx, scrollToPage, goNextChapter]);

  const goPrev = useCallback(() => {
    if (!pages.length) return;

    const delta = direction === "rtl" ? 1 : -1;
    const prevIdx = activeIdx + delta;

    if (!scrollToPage(prevIdx)) {
      goPrevChapter();
    }
  }, [pages.length, direction, activeIdx, scrollToPage, goPrevChapter]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showUi) return;

      const key = e.key.toLowerCase();

      const isNext = key === "d" || key === "arrowright";
      const isPrev = key === "a" || key === "arrowleft";

      if (!isNext && !isPrev) return;

      e.preventDefault();

      if (isNext) {
        goNext();
      }

      if (isPrev) {
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUi, goNext, goPrev]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setActiveIdx(0);
      setLoadedPages({});
      setPageMeta({});
      setShowUi(false);
      pageRefs.current = [];
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [chapterId]);

  useEffect(() => {
    if (!pages.length || readingMode === "single") return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestMatch = null;
        let bestRatio = 0;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestMatch = entry;
          }
        }

        const idx = Number(bestMatch?.target?.dataset?.index);

        if (Number.isFinite(idx)) {
          requestAnimationFrame(() => {
            setActiveIdx(idx);
          });
        }
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75, 1],
      }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pages, readingMode]);

  useEffect(() => {
    if (!pages.length) return;

    const targets = direction === "rtl"
      ? [activeIdx - 1, activeIdx - 2]
      : [activeIdx + 1, activeIdx + 2];

      targets
        .filter((i) => i >= 0 && i < pages.length)
        .forEach((i) => {
          if (preloadedRef.current.has(i)) return;

          const src = pages[i]?.image;
          if(!src) return;

          const img = new Image();
          img.src = src;  // browser starts fetching + caching
          preloadedRef.current.add(i);
        });
  }, [activeIdx, pages, direction]);

  const handleBack = () => {
    navigate(`/manga/${mangaId}`);
  };

  return (
    <div 
      className={`
        flex-1 min-h-screen flex flex-col pt-20
        ${
          backgroundColors === "black" ? "bg-black" :
          backgroundColors === "gray" ? "bg-gray-300" :
          backgroundColors === "white" ? "bg-white" :
          "bg-(--main)"
        }
      `}
    >
      {/* LOADING STATE (FULL CENTER FIX) */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-(--action-hover) border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-(--text-muted)">
              Loading chapter...
            </p>
          </div>
        </div>
      ) : error ? (
        /* ERROR STATE */
        <div className="flex-1 flex items-center justify-center text-center">
          <div className="flex flex-col gap-3">
            <p className="text-red-500 dark:text-red-600">{error}</p>

            <button
              onClick={handleBack}
              className="px-3 py-2 bg-(--action) hover:bg-(--action-hover) text-white rounded-lg cursor-pointer"
            >
              Go back
            </button>
          </div>
        </div>
      ) : (
        /* MAIN READER */
        <div className="flex-1 relative">
          <div
            className={`
              relative py-6
              ${readingMode === "single"
                ? "flex justify-center items-center"
                : "flex flex-col items-center gap-4"
              }
            `}
          >
            {/* TAP ZONES */}
            <div className="fixed inset-x-0 top-0 bottom-12 z-10 flex pointer-events-none">
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() => !showUi && goPrev()}
              />
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() => setShowUi(prev => !prev)}
              />
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() => !showUi && goNext()}
              />
            </div>

            <ShowUIBar
              showUI={showUi}
              setShowUI={setShowUi}
              activeIdx={activeIdx}
              setActiveIdx={setActiveIdx}
              pages={pages}
              scrollToPage={scrollToPage}
              chapterTitle={mangaMeta?.title || "Unknown Manga"}
              chapterLabel={chapterLabel}
              chapters={chapters}
              mangaMeta={mangaMeta}
              mangaId={mangaId}
              currentChapterId={chapterId}
              prevChapter={prevChapter}
              nextChapter={nextChapter}
              readingMode={readingMode}
              setReadingMode={setReadingMode}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              direction={direction}
              setDirection={setDirection}
              onOpenSettings={() => setShowSettings(true)}
            />

            <ReaderSettingsModal
              isOpen={showSettings} 
              onClose={() => setShowSettings(false)}
              readingMode={readingMode}
              setReadingMode={setReadingMode}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              direction={direction}
              setDirection={setDirection}

              backgroundColors={backgroundColors}
              setBackgroundColors={setBackgroundColors}
              progressBar={progressBar}
              setProgressBar={setProgressBar}
              progressBarPositon={progressBarPosition}
              setProgressBarPosition={setProgressBarPosition}
            />

            {pages.map((page, i) => {
              const isHidden =
                readingMode === "single" && i !== activeIdx;
              const isWide = pageMeta[i]?.isWide;

              return (
                <div
                  key={i}
                  className={`
                    relative w-full flex justify-center items-center px-2
                    ${!loadedPages[i] ? "min-h-[70vh]" : ""}
                    ${isHidden ? "hidden" : ""}
                  `}
                >
                  {/* Skeleton (centered properly now) */}
                  {!loadedPages[i] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <img
                    ref={(el) => (pageRefs.current[i] = el)}
                    data-index={i}
                    src={page.image}
                    alt={`Page ${i + 1}`}
                    className={`
                      block mx-auto rounded-lg shadow-lg
                      ${
                        displayMode === "original" && !isWide
                          ? "w-auto max-w-full object-contain"
                          : "w-full max-w-full object-contain"
                      }
                      ${
                        displayMode === "width"
                          ? "w-full"
                          : ""
                      }
                      ${
                        displayMode === "screen"
                          ? "max-h-screen object-contain"
                          : ""
                      }
                      ${loadedPages[i] ? "opacity-100" : "opacity-0"}
                    `}
                    loading="lazy"
                    onLoad={(e) =>
                      requestAnimationFrame(() =>
                        handleImageLoad(i, e)
                      )
                    }
                  />
                </div>
              );
            })}

            {/* Pagination */}
            <div 
              className={`
                fixed z-20 pointer-events-none
                ${progressBarPosition === "bottom"
                  ? "bottom-0 left-0 w-full px-2 py-2 "
                  : progressBarPosition === "left"
                  ? "left-0 top-20 h-[calc(100%-5rem)] flex flex-col px-2 py-2 "
                  : "right-0 top-20 h-[calc(100%-5rem)] flex flex-col px-2 py-2"
                }
              `}
            >
              {progressBar === "standard" ? (
                // Progress bar
                <div 
                  className={`
                    flex gap-0.5 
                    ${progressBarPosition === "bottom" ? "flex-row" : "flex-col h-full"}
                    ${direction === "rtl" ? "flex-row-reverse" : ""}
                  `}
                >
                  {pages.map((_, idx) => {
                    const isActive = activeIdx === idx;

                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          readingMode === "single"
                            ? setActiveIdx(idx)
                            : scrollToPage(idx)
                        }
                        className={`
                          rounded-full transition-all duration-200 cursor-pointer pointer-events-auto
                          ${progressBarPosition === "bottom"
                            ? "flex-1 h-1"
                            : "w-1.5 flex-1"
                          }
                          ${
                            isActive
                              ? "bg-(--action-alt) scale-y-125"
                              : "bg-(--component) hover:bg-(--component-hover)"
                          }
                        `}
                      />
                    )
                  })}
                </div>
              ) : (
                // Hidden mode
                <div
                  className={`
                    pointer-events-auto
                    ${progressBarPosition === "bottom"
                      ? "flex justify-center"
                      : "flex items-center justify-center h-full"
                    }
                  `}
                >
                  <div className="px-3 py-1 rounded-lg bg-(--component)/20 text-(--text-main) text-sm backdrop-blur-lg shadow-xl">
                    {activeIdx + 1} / {pages.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadPage;
