import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTopBtn from "../components/ScrollToTopBtn";
import { useMangaFeed } from "../hooks/useMangaFeed";
import { mangaApi } from "../api";
import PageHeader from "../components/PageHeader";
import ErrorState from "../components/ErrorState";
import MangaGrid from "../components/MangaGrid";

function PopularPage() {
    const {
        mangas,
        initialLoading,
        initialError,
        loadMoreError,
        loadingMore,
        loaderRef,
        retry,
        hasMore,
    } = useMangaFeed({
        fetchFn: mangaApi.getPopularManga,
        limit: 20,
    });

    return(
        <div className="min-h-screen flex flex-col bg-(--main)">
            <Navbar />

            <div className="flex-1 pt-20 px-4">
                <ScrollToTopBtn />

                <PageHeader title="Popular Manga" />

                {initialError && (
                    <ErrorState message={initialError} onRetry={retry} />
                )}

                <MangaGrid mangas={mangas} loading={initialLoading} />

                {loadingMore && (
                    <p className="text-center mt-6">
                        Loading more...
                    </p>
                )}

                {loadMoreError && (
                    <p className="text-center text-red-500 mt-4">
                        Failed to load more. Try again.
                    </p>
                )}

                {hasMore && (
                    <div ref={loaderRef} className="h-10 mt-10" />
                )}
            </div>

            <Footer />
        </div>
    );
}

export default PopularPage