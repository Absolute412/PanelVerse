import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ShowUIBar from "../components/ShowUIBar";
import ReaderSettingsModal from "../components/ReaderSettingsModal";
import { useMangaProgress } from "../hooks/useMangaProgress";
import { useReaderSettings } from "../hooks/useReaderSettings";
import { useChapterPages } from "../hooks/useChapterPages";
import { useChapters } from "../hooks/useChapters";
import { useChapterNavigation } from "../hooks/useChapterNavigation";
import { getMangaProgress } from "../utils/storageService";

const EMPTY_CHAPTERS = [];

const getChapterNumericValue = (chapter) => {
  const fromNumber = parseFloat(chapter?.number);
  if (!Number.isNaN(fromNumber)) return fromNumber;

  const title = String(chapter?.title || "");
  const match = title.match(/chapter\s*([\d.]+)/i) || title.match(/(\d+(?:\.\d+)?)/);
  if (!match) return Number.NEGATIVE_INFINITY;

  const fromTitle = parseFloat(match[1]);
  return Number.isNaN(fromTitle) ? Number.NEGATIVE_INFINITY : fromTitle;
};

const isLikelyMangaDexChapterId = (value) => {
  const normalized = String(value || "").trim();
  // MangaDex chapter IDs are UUIDs.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized);
};

const isLikelyUlid = (value) => {
  const normalized = String(value || "").trim();
  // WeebCentral chapter IDs in our flow commonly look like ULIDs (26 Crockford Base32 chars).
  return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(normalized);
};

const sanitizeSourceForChapterId = (source, id) => {
  if (!source) return null;
  // Ignore stale route/storage source if ID shape does not match MangaDex.
  if (source === "mangadex" && !isLikelyMangaDexChapterId(id)) return null;
  return source;
};

const inferSourceFromChapterId = (id) => {
  // Last-resort inference when chapter metadata is unavailable (e.g. Continue Reading direct open).
  if (isLikelyMangaDexChapterId(id)) return "mangadex";
  if (isLikelyUlid(id)) return "weebcentral";
  return null;
};

const ReadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;

  const { mangaId, chapterId } = useParams();

  // Keep fallback chapters stable without useMemo to avoid React Compiler dependency warnings.
  const initialRouteChapters = Array.isArray(locationState?.chapters)
    ? locationState.chapters
    : EMPTY_CHAPTERS;

  const { chapters, loading: chaptersLoading } = useChapters(mangaId, initialRouteChapters);

  const currentChapter = chapters.find(c => c.id === chapterId);

  const routeChapterSource = sanitizeSourceForChapterId(
    initialRouteChapters.find(c => c.id === chapterId)?.source || locationState?.source || null,
    chapterId
  );
  // Priority: live chapter metadata > route hint > ID-shape inference after chapter list load.
  const source =
    currentChapter?.source ||
    routeChapterSource ||
    (!chaptersLoading ? inferSourceFromChapterId(chapterId) : null);
  const storedProgressMeta = getMangaProgress(mangaId);
  const mangaMeta = locationState?.manga || {
    title: storedProgressMeta?.title || null,
    imageThumb: storedProgressMeta?.imageThumb || "/placeholder.jpg",
    imageMedium:
      storedProgressMeta?.imageMedium ||
      storedProgressMeta?.imageThumb ||
      "/placeholder.jpg",
  };
  const readerRouteState = {
    chapters,
    manga: mangaMeta,
  };

  const { pages, loading, error } = useChapterPages(chapterId, source);
  // Stay in loading UI until we either resolved source or failed explicitly.
  const isReaderLoading = loading || (!source && chaptersLoading);
  const sourceResolveError = !source && !chaptersLoading
    ? "Unable to resolve chapter source for this saved chapter."
    : null;
  const chapterDropdownList = [...chapters].sort((a, b) => {
    const na = getChapterNumericValue(a);
    const nb = getChapterNumericValue(b);

    if (na === nb) {
      return String(b?.title || "").localeCompare(String(a?.title || ""));
    }

    return nb - na;
  });

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
    routeState: readerRouteState,
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [loadedPages, setLoadedPages] = useState({});

  const [showUi, setShowUi] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pageMeta, setPageMeta] = useState({});
  const [singlePageTransition, setSinglePageTransition] = useState("");
  const pageRefs = useRef([]);
  const transitionTimeoutRef = useRef(null);

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
    source,
    pages,
    activeIdx,
    mangaMeta,
    scrollToPage,
  });

  const goNext = useCallback(() => {
    if (!pages.length) return;

    if (readingMode === "single") {
      const enterFrom = direction === "rtl" ? "from-left" : "from-right";
      setSinglePageTransition(enterFrom);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setSinglePageTransition("");
      }, 260);
    }

    const delta = direction === "rtl" ? -1 : 1;
    const nextIdx = activeIdx + delta;

    if (!scrollToPage(nextIdx)) {
      goNextChapter();
    }
  }, [pages.length, direction, activeIdx, scrollToPage, goNextChapter, readingMode]);

  const goPrev = useCallback(() => {
    if (!pages.length) return;

    if (readingMode === "single") {
      const enterFrom = direction === "rtl" ? "from-right" : "from-left";
      setSinglePageTransition(enterFrom);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setSinglePageTransition("");
      }, 260);
    }

    const delta = direction === "rtl" ? 1 : -1;
    const prevIdx = activeIdx + delta;

    if (!scrollToPage(prevIdx)) {
      goPrevChapter();
    }
  }, [pages.length, direction, activeIdx, scrollToPage, goPrevChapter, readingMode]);

  const currentIsWide = pageMeta[activeIdx]?.isWide;

  const containerClass = `
    relative flex flex-col items-center justify-center py-6
    ${readingMode === "single" && currentIsWide ? "min-h-[calc(100vh-7rem)]" : ""}
    ${readingMode !== "single" ? "gap-4" : ""}
  `;

  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const dx = touchEnd.current.x - touchStart.current.x;
    const dy = touchEnd.current.y - touchStart.current.y;

    // Ignore vertical scrolls
    if (Math.abs(dy) > Math.abs(dx)) return;

    const threshold = 50; // swipe sensitivity

    if (Math.abs(dx) < threshold) return;

    const swipedLeft = dx < 0;
    if (direction === "rtl") {
      swipedLeft ? goPrev() : goNext();
    } else {
      swipedLeft ? goNext() : goPrev();
    }
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

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
      {isReaderLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-(--action-hover) border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-(--text-muted)">
              Loading chapter...
            </p>
          </div>
        </div>
      ) : (error || sourceResolveError) ? (
        /* ERROR STATE */
        <div className="flex-1 flex items-center justify-center text-center">
          <div className="flex flex-col gap-3">
            <p className="text-red-500 dark:text-red-600">{error || sourceResolveError}</p>

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
        <div 
          className="flex-1 relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={containerClass}>
            {/* TAP ZONES */}
            <div className="fixed inset-x-0 top-0 bottom-12 z-10 flex pointer-events-none">
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() =>
                  !showUi && (direction === "rtl" ? goNext() : goPrev())
                }
              />
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() => setShowUi(prev => !prev)}
              />
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() =>
                  !showUi && (direction === "rtl" ? goPrev() : goNext())
                }
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
              chapterListDisplay={chapterDropdownList}
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

            {(readingMode === "single"
              ? pages
                  .map((page, i) => ({ page, i }))
                  .filter(({ i }) => i === activeIdx)
              : pages.map((page, i) => ({ page, i }))
            ).map(({ page, i }) => {
              const isHidden =
                readingMode === "single" && i !== activeIdx;
              const isWide = pageMeta[i]?.isWide;
              const singlePageTransitionClass =
                readingMode === "single"
                  ? singlePageTransition === "from-right"
                    ? "reader-enter-from-right"
                    : singlePageTransition === "from-left"
                    ? "reader-enter-from-left"
                    : "opacity-100"
                  : "";

              return (
                <div
                  key={i}
                  className={`
                    relative w-full flex justify-center items-center px-2 transition-transform duration-300
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
                      ${singlePageTransitionClass}
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
