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
  const [swipeOffsetX, setSwipeOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const pageRefs = useRef([]);
  const swipeStartRef = useRef({ x: 0, y: 0, time: 0 });
  const swipeMetaRef = useRef({ isHorizontal: false });
  const swipeResetTimeoutRef = useRef(null);
  const readerViewportRef = useRef(null);
  const preloadedRef = useRef(new Set());

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    const updateZoomState = () => {
      setIsZoomed(viewport.scale > 1.01);
    };

    updateZoomState();

    viewport.addEventListener("resize", updateZoomState);
    viewport.addEventListener("scroll", updateZoomState);
    
    return () => {
      viewport.removeEventListener("resize",updateZoomState);
      viewport.removeEventListener("scroll", updateZoomState);
    };
  }, []);

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

    setLoadedPages((prev) => ({
      ...prev,
      [idx]: true,
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

    const delta = direction === "rtl" ? -1 : 1;
    const nextIdx = activeIdx + delta;

    if (!scrollToPage(nextIdx)) {
      if (direction === "rtl") {
        goPrevChapter();
      } else {
        goNextChapter();
      }
    }
  }, [pages.length, direction, activeIdx, scrollToPage, goNextChapter, goPrevChapter]);

  const goPrev = useCallback(() => {
    if (!pages.length) return;

    const delta = direction === "rtl" ? 1 : -1;
    const prevIdx = activeIdx + delta;

    if (!scrollToPage(prevIdx)) {
      if (direction === "rtl") {
        goNextChapter();
      } else {
        goPrevChapter();
      }
    }
  }, [pages.length, direction, activeIdx, scrollToPage, goPrevChapter, goNextChapter]);


  const containerClass = `
    relative flex flex-col items-center justify-start py-2
    ${readingMode !== "single" ? "gap-4" : ""}
  `;

  const getSwipeNav = useCallback((swipeDirection) => {
    if (swipeDirection === "left") {
      return direction === "rtl" ? "next" : "next";
    }
    return direction === "rtl" ? "prev" : "prev";
  }, [direction]);

  const getPageDeltaForNav = useCallback((nav) => {
    if (nav === "next") return direction === "rtl" ? -1 : 1;
    return direction === "rtl" ? 1 : -1;
  }, [direction]);

  const getPreviewIndexForSwipe = useCallback((swipeDirection) => {
    const nav = getSwipeNav(swipeDirection);
    const idx = activeIdx + getPageDeltaForNav(nav);
    return idx >= 0 && idx < pages.length ? idx : null;
  }, [activeIdx, pages.length, getSwipeNav, getPageDeltaForNav]);

  const animateSwipeAndNavigate = useCallback((nav, offsetTarget) => {
    setIsSwipeAnimating(true);
    setSwipeOffsetX(offsetTarget);

    if (swipeResetTimeoutRef.current) {
      clearTimeout(swipeResetTimeoutRef.current);
    }

    swipeResetTimeoutRef.current = setTimeout(() => {
      if (nav === "next") goNext();
      else goPrev();

      setSwipeOffsetX(0);
      setIsSwiping(false);
      setIsSwipeAnimating(false);
    }, 180);
  }, [goNext, goPrev]);

  const handleTouchStart = (e) => {
    if (showUi || isSwipeAnimating) return;

    if (isZoomed) return;

    if (e.touches.length > 1 || isZoomed) {
      swipeMetaRef.current.isMultiTouch = true;
      return;
    }

    const touch = e.touches?.[0];
    if (!touch) return;

    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    swipeMetaRef.current = { isHorizontal: false, isMultiTouch: false };
    setIsSwiping(false);
  };

  const handleTouchMove = (e) => {
    if (readingMode !== "single" || isSwipeAnimating) return;

    if (e.touches.length > 1) {
      swipeMetaRef.current.isMultiTouch = true;
      return;
    }

    if (swipeMetaRef.current.isMultiTouch) return;

    if (isZoomed) {
      return;
    }

    const touch = e.touches?.[0];
    if (!touch) return;

    const dx = touch.clientX - swipeStartRef.current.x;
    const dy = touch.clientY - swipeStartRef.current.y;

    if (!swipeMetaRef.current.isHorizontal) {
      if (Math.abs(dx) <= Math.abs(dy)) return;
      swipeMetaRef.current.isHorizontal = true;
      setIsSwiping(true);
    }

    const leftPreviewIdx = getPreviewIndexForSwipe("left");
    const rightPreviewIdx = getPreviewIndexForSwipe("right");
    const hasLeftPreview = leftPreviewIdx !== null;
    const hasRightPreview = rightPreviewIdx !== null;

    let boundedDx = dx;
    if (dx < 0 && !hasLeftPreview) boundedDx *= 0.25;
    if (dx > 0 && !hasRightPreview) boundedDx *= 0.25;

    setSwipeOffsetX(boundedDx);
  };

  const handleTouchEnd = (e) => {
    if (isZoomed) return;

    if (showUi || isSwipeAnimating) return;

    if (swipeMetaRef.current.isMultiTouch) {
      setIsSwiping(false);
      setSwipeOffsetX(0);
      return;
    }

    const touch = e.changedTouches?.[0];
    if (!touch) return;

    const dx = touch.clientX - swipeStartRef.current.x;
    const dy = touch.clientY - swipeStartRef.current.y;
    const dt = Math.max(1, Date.now() - swipeStartRef.current.time);
    const velocityX = dx / dt;

    if (readingMode !== "single") {
      if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 50) {
        setIsSwiping(false);
        setSwipeOffsetX(0);
        return;
      }

      if (dx < 0) {
        direction === "rtl" ? goPrev() : goNext();
      } else {
        direction === "rtl" ? goNext() : goPrev();
      }
      setIsSwiping(false);
      setSwipeOffsetX(0);
      return;
    }

    const width = readerViewportRef.current?.clientWidth || window.innerWidth || 1;
    const threshold = Math.min(120, Math.max(40, width * 0.22));
    const fastSwipe = Math.abs(velocityX) > 0.45;

    // Fallback check on release so swipe still works on devices that emit sparse touchmove events.
    if (Math.abs(dx) <= Math.abs(dy)) {
      setIsSwiping(false);
      setSwipeOffsetX(0);
      return;
    }

    const swipeDirection = dx < 0 ? "left" : "right";
    const nav = getSwipeNav(swipeDirection);
    const previewIdx = getPreviewIndexForSwipe(swipeDirection);
    const canTurnPage = previewIdx !== null;

    if (canTurnPage && (Math.abs(dx) >= threshold || fastSwipe)) {
      const targetOffset = swipeDirection === "left" ? -width : width;
      animateSwipeAndNavigate(nav, targetOffset);
      return;
    }

    setIsSwipeAnimating(true);
    setSwipeOffsetX(0);
    if (swipeResetTimeoutRef.current) {
      clearTimeout(swipeResetTimeoutRef.current);
    }
    swipeResetTimeoutRef.current = setTimeout(() => {
      setIsSwipeAnimating(false);
      setIsSwiping(false);
    }, 160);
  };

  useEffect(() => {
    return () => {
      if (swipeResetTimeoutRef.current) {
        clearTimeout(swipeResetTimeoutRef.current);
      }
    }
  }, []);

  const handleTouchCancel = () => {
    if (swipeResetTimeoutRef.current) {
      clearTimeout(swipeResetTimeoutRef.current);
    }
    setIsSwiping(false);
    setIsSwipeAnimating(false);
    setSwipeOffsetX(0);
  };

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
        h-full w-full flex flex-col
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
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-(--action-hover) border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-(--text-muted)">
              Loading chapter...
            </p>
          </div>
        </div>
      ) : (error || sourceResolveError) ? (
        /* ERROR STATE */
        <div className="flex-1 flex items-center justify-center text-center min-h-screen">
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
          className="flex-1 relative mt-4 sm:mt-20"
          ref={readerViewportRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          style={{ 
            touchAction: readingMode === "single" 
              ? (isZoomed ? "auto" : "pan-y pinch-zoom")
              : "pan-y" 
          }}
        >
          <div className={containerClass}>
            {/* TAP ZONES */}
            <div 
              className={`
                fixed inset-x-0 top-0 bottom-12 z-10 flex
                ${isZoomed ? "pointer-events-none" : ""}
              `}
            >
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() =>
                  !showUi && !isSwipeAnimating && goPrev()
                }
              />
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() => setShowUi(prev => !prev)}
              />
              <div
                className="w-1/3 h-full pointer-events-auto"
                onClick={() =>
                  !showUi && !isSwipeAnimating && goNext()
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

            {readingMode === "single" ? (() => {
              const prevIdx = getPreviewIndexForSwipe("right"); // swipe right = prev (physically)
              const nextIdx = getPreviewIndexForSwipe("left");  // swipe left = next (physically)
              const showSwipeTrack = !isZoomed && (isSwiping || isSwipeAnimating || swipeOffsetX !== 0);

              const leftIdx = prevIdx;
              const rightIdx = nextIdx;
              const swipeTransitionClass = isSwipeAnimating ? "transition-transform duration-180 ease-out" : "";
              const trackStyle = {
                transform: `translate3d(calc(-100% + ${swipeOffsetX}px), 0, 0)`,
              };
              const renderPagePanel = (idx, panelKey) => {
                if (idx === null || !pages[idx]) {
                  return <div key={panelKey} className="w-full shrink-0" />;
                }

                const page = pages[idx];

                return (
                  <div
                    key={panelKey}
                    className={`
                      relative w-full shrink-0 flex justify-center items-center min-h-screen px-2
                    `}
                  >
                    {!loadedPages[idx] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    <img
                      src={page.image}
                      alt={`Page ${idx + 1}`}
                      className={`
                        block mx-auto rounded-lg shadow-lg object-contain max-w-full w-auto
                        ${displayMode === "original" ? "w-auto max-h-none" : ""}
                        ${displayMode === "width" ? "w-full" : ""}
                        ${displayMode === "screen" ? "h-screen object-contain" : ""}
                        ${loadedPages[idx] ? "opacity-100" : "opacity-0"}
                      `}
                      loading="lazy"
                      onLoad={(e) => requestAnimationFrame(() => handleImageLoad(idx, e))}
                    />
                  </div>
                );
              };

              return (
                <div className="relative w-full overflow-hidden">
                  {showSwipeTrack ? (
                    <div className={`flex items-start ${swipeTransitionClass}`} style={trackStyle}>
                      {renderPagePanel(leftIdx, "left")}
                      {renderPagePanel(activeIdx, "center")}
                      {renderPagePanel(rightIdx, "right")}
                    </div>
                  ) : (
                    <div className="flex items-start">
                      {renderPagePanel(activeIdx, "center")}
                    </div>
                  )}
                </div>
              );
            })() : pages.map((page, i) => {
              const isHidden =
                readingMode === "single" && i !== activeIdx;

              return (
                <div
                  key={i}
                  className={`
                    relative w-full flex justify-center items-start px-2
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
                      block mx-auto rounded-lg shadow-lg object-contain max-w-full
                      ${displayMode === "original" ? "w-auto max-h-none" : ""}
                      ${displayMode === "width" ? "w-full" : ""}
                      ${displayMode === "screen" ? "w-auto max-w-full" : ""}
                      ${displayMode !== "original" && displayMode !== "width" && displayMode !== "screen" ? "w-full max-w-full" : ""}
                      ${loadedPages[i] ? "opacity-100" : "opacity-0"}
                    `}
                    loading="lazy"
                    onLoad={(e) => requestAnimationFrame(() => handleImageLoad(i, e))
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
                          relative rounded-full transition-all duration-200 cursor-pointer pointer-events-auto group
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
                      >
                        <div 
                          className={`
                            absolute px-2 py-1 rounded-md
                            leading-none text-xs text-(--text-main) whitespace-nowrap shadow-lg opacity-0 invisible
                            transition-all duration-150 group-hover:opacity-100 group-hover:visible
                            ${isActive ? "bg-(--action-alt)" : "bg-(--component)"}
                            ${progressBarPosition === "bottom"
                              ? "left-1/2 bottom-full mb-2 -translate-x-1/2"
                              : progressBarPosition === "left"
                              ? "left-full top-1/2 ml-2  -translate-y-1/2"
                              : "right-full top-1/2 mr-2  -translate-y-1/2"
                            }
                          `}
                        >
                            {idx + 1}
                          </div>
                      </div>
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
