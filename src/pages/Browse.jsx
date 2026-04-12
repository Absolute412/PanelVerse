import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

  return (
    <div className="min-h-screen flex flex-col bg-(--main)">
      <Navbar />

      <div className="flex-1 pt-20 px-4">
        <ScrollToTopBtn />

        <PageHeader title="Browse" />

        <div className="mt-4">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {initialError && (
          <ErrorState message={initialError} />
        )}

        <MangaGrid mangas={mangas} loading={initialLoading} />

        {loadingMore && (
          <p className="text-center mt-6 text-gray-500">
            Loading more...
          </p>
        )}

        {loadMoreError && (
          <p className="text-center mt-4 text-red-500">
            Failed to load more
          </p>
        )}

        {!debounced && <div ref={loaderRef} className="h-10 mt-10" />}
      </div>

      <Footer />
    </div>
  );
}

export default Browse;