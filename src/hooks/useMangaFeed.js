import { useCallback, useEffect, useRef, useState } from "react";

export function useMangaFeed({
  fetchFn,
  limit = 20,
  searchTerm = "",
  mode = "feed"
}) {
  const [mangas, setMangas] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [initialError, setInitialError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  const isSearching = mode === "search";

  // RESET + INITIAL LOAD
  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      try {
        setInitialLoading(true);
        setInitialError(null);

        // RESET
        setMangas([]);
        setOffset(0);
        setHasMore(true);

        const data = await fetchFn(limit, 0, searchTerm);

        if (cancelled) return;

        setMangas(data);
        setOffset(limit);

        // IMPORTANT
        if (searchTerm.trim() !== "") {
          setHasMore(false);    // disable loadmore completely for search
        }

        setInitialLoading(false);

      } catch (err) {
        console.error(err);
        setInitialError("Failed to load manga");
        setMangas([]);
        setHasMore(false);
      }
    };

    loadInitial();

    return () => {
      cancelled = true;
    };
  }, [fetchFn, limit, searchTerm, isSearching]);

  //  LOAD MORE
  const loadMore = useCallback(async () => {
    if (isSearching) return;    // never run in search
    if (loadingMore || !hasMore || initialLoading) return;

    try {
      setLoadingMore(true);
      setLoadMoreError(false);

      const more = await fetchFn(limit, offset, searchTerm);

      if (!more || more.length === 0) {
        setHasMore(false);
      } else {
        setMangas(prev => [...prev, ...more]);
        setOffset(prev => prev + limit);
      }
    } catch (err) {
      console.error(err);
      setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchFn, limit, offset, searchTerm, hasMore, loadingMore, initialLoading, isSearching]);

  // THIS IS THE MISSING PIECE (INTERSECTION OBSERVER)
  useEffect(() => {
    if (isSearching) return;   // STOP infinite scroll during seach
    if (!loaderRef.current) return;
    if (!hasMore) return;
    if (initialLoading || initialError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasMore, initialLoading, initialError, isSearching]);

  // retry
  const retry = () => {
    setOffset(0);
    setMangas([]);
    setHasMore(true);
  };

  return {
    mangas,
    initialLoading,
    loadingMore,
    initialError,
    loadMoreError,
    loadMore,
    loaderRef,
    hasMore,
    retry,
  };
}