import { useMemo, useState } from "react";
import ScrollToTopBtn from "../components/ScrollToTopBtn";
import PageHeader from "../components/PageHeader";
import ErrorState from "../components/ErrorState";
import MangaGrid from "../components/MangaGrid";
import Search from "../components/Search";
import { useDebounce } from "react-use";
import { useMangaFeed } from "../hooks/useMangaFeed";
import { mangaApi } from "../api";

function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  const fetchFn = useMemo(() => {
    return debounced
      ? (limit, offset, searchTerm) =>
        mangaApi.searchManga(searchTerm, limit, offset)
      : mangaApi.getPopularManga;
  }, [debounced]);

  useDebounce(() => setDebounced(searchTerm), 500, [searchTerm]);

  const {
    mangas,
    initialLoading,
    loadingMore,
    initialError,
    loadMoreError,
    loaderRef,
  } = useMangaFeed({
    fetchFn,
    limit: 20,
    searchTerm: debounced,
    mode: debounced ? "search" : "feed"   // THIS is key
  });

  const isSearchMode = debounced.trim() !== "";
  const isSearchEmpty = isSearchMode && !initialLoading && !initialError && mangas.length === 0;

  return (
    <div className="flex-1 pt-20 px-4">
      <ScrollToTopBtn />

      <PageHeader title="Browse" />

      <div className="mt-4">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {initialError && <ErrorState message={initialError} />}

      <MangaGrid mangas={mangas} loading={initialLoading} />

      {isSearchEmpty && (
        <div className="mt-8 text-center">
          <p className="text-(--text-main) font-medium">Manga not found</p>
          <p className="text-sm text-(--text-muted) mt-1">Try another title or different spelling.</p>
        </div>
      )}

      {loadingMore && (
        <div className="flex-1 flex items-center justify-center mt-6">
          <div className="w-10 h-10 border-4 border-(--action-hover) border-t-transparent animate-spin rounded-full" />
        </div>
      )}

      {loadMoreError && (
        <p className="text-center mt-4 text-red-500">
          Failed to load more
        </p>
      )}

      {!debounced && <div ref={loaderRef} className="h-10 mt-10" />}
    </div>
  );
}

export default Browse;
