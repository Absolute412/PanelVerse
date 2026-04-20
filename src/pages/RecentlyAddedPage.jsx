import ScrollToTopBtn from "../components/ScrollToTopBtn";
import { useMangaFeed } from "../hooks/useMangaFeed";
import { mangaApi } from "../api";
import PageHeader from "../components/PageHeader";
import ErrorState from "../components/ErrorState";
import MangaGrid from "../components/MangaGrid";

function RecentlyAddedPage() {
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
    fetchFn: mangaApi.getRecentlyAddedManga,
    limit: 20,
  });

  return (
    <div className="flex-1 pt-20 px-4">
      <ScrollToTopBtn />

      <PageHeader title="Recently Added Manga" />

      {initialError && (
        <ErrorState message={initialError} onRetry={retry} />
      )}

      <MangaGrid mangas={mangas} loading={initialLoading} />

      {loadingMore && (
        <p className="text-center mt-6 text-gray-500">
          Loading more...
        </p>
      )}

      {loadMoreError && (
        <p className="text-center mt-4 text-red-500">
          Failed to load more. Try again.
        </p>
      )}

      {hasMore && <div ref={loaderRef} className="h-10 mt-10" />}
    </div>
  );
}

export default RecentlyAddedPage;