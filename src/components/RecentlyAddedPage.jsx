import { useCallback, useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Card from "./Card";
import ScrollToTopBtn from "./ScrollToTopBtn";
import { mangaApi } from "../api";
import SkeletonCard from "./SkeletonCard";

function RecentlyAddedPage() {
    const [mangas, setMangas] = useState([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [initialError, setInitialError] = useState(null);
    const [loadMoreError, setLoadMoreError] = useState(false);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [retryKey, setRetryKey] = useState(0);

    const loaderRef = useRef(null);
    const LIMIT = 20;

    const loadMore = useCallback (async () => {
    if (loadingMore || !hasMore || loadMoreError) return;

    setLoadingMore(true);
    setLoadMoreError(false);

    try {
        const more = await mangaApi.getRecentlyAddedManga(LIMIT, offset);

        if (more.length === 0) {
        setHasMore(false);
        } else {
        setMangas(prev => [...prev, ...more]);
        setOffset(prev => prev + LIMIT);
        }
    } catch (err) {
        console.error(err);
        setLoadMoreError(true);
    } finally {
        setLoadingMore(false);
    }
    }, [loadingMore, hasMore, offset, loadMoreError]);

    /* ---------------- INITIAL / SEARCH FETCH ---------------- */
    useEffect(() => {
    let active = true;

    const fetchManga = async () => {
      try {
        setInitialLoading(true);
        setInitialError(null);
        setLoadMoreError(false);
  
        const data = await mangaApi.getRecentlyAddedManga(LIMIT);
        if (active) {
            setMangas(data);
            setOffset(LIMIT);
            setHasMore(true);
        }
      } catch (err) {
        console.error("Error fetching manga:", err);
        if (active) {
            setInitialError("You are offline or the server is unreachable");
            setMangas([]);
            setHasMore(false);
        }
      } finally {
        if (active) setInitialLoading(false);
      }
    }

    fetchManga();
    return () => (active = false);
  }, [retryKey]);

    /* ---------------- INFINITE SCROLL ---------------- */
   useEffect(() => {
        if (
        initialLoading || 
        initialError ||
        loadMoreError
        ) return; // no infinite scroll for search

        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            loadMore();
            }
        },
        { threshold: 1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => observer.disconnect();

    }, [loadMore, initialLoading, initialError, loadMoreError]);

    return(
        <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
            <Navbar />

            <div className="flex-1 pt-20 pb-6 px-4 sm:px-6">
                <ScrollToTopBtn />

                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-[15px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                            Recently Added Manga
                        </span>
                        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                    </div>
                </div>

                {!initialLoading && !initialError && mangas.length === 0 && (
                <p className="mt-10 text-center text-gray-600">
                    No manga found
                </p>
                )}

                {initialError && !initialLoading &&(
                <div className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-center text-red-500">
                        {initialError}
                    </p>

                    <button 
                        disabled={initialLoading}
                        onClick={() => setRetryKey(prev => prev + 1)} 
                        className="
                            px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50
                            disabled:cursor-not-allowed text-white rounded-md cursor-pointer"
                    >Retry</button>
                </div>
                )}

                <div className="mt-10 grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {mangas.map(manga => (
                        <Link key={manga.id} to={`/manga/${manga.id}`}>
                            <Card manga={manga} />
                        </Link>
                    ))}

                    {initialLoading &&
                    Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>

                {loadingMore && !loadMoreError && (
                    <p className="text-center text-gray-500 mt-6">Loading more...</p>
                )}

                {loadMoreError && mangas.length> 0 && (
                    <div className="flex flex-col items-center gap-3 mt-10">
                        <p className="text-center text-red-500 mt-10">
                            You're offline. Can't load more manga.
                        </p>

                        <button 
                            onClick={() => {
                            setLoadMoreError(false);
                            loadMore();
                        }}
                        disabled={loadingMore}
                        className="px-4 py-2 rounded-md text-sm font-medium
                                            bg-blue-500 hover:bg-blue-600 text-white
                                            disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                        {loadingMore ? "Retrying..." : "Retry"}
                    </button>
                </div>
                )}

                {/* nfinite Scroll Trigger */}
                {!loadMoreError && (
                    <div ref={loaderRef} className="h-10 mt-10" />
                )}

                {!initialError && !loadingMore && mangas.length > 0 && !hasMore && (
                    <p className="text-center text-gray-500 mt-10">
                        You’ve reached the end 👀
                    </p>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default RecentlyAddedPage