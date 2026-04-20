import ScrollToTopBtn from "../components/ScrollToTopBtn";
import { useMangaFeed } from "../hooks/useMangaFeed";
import { mangaApi } from "../api";
import PageHeader from "../components/PageHeader";
import ErrorState from "../components/ErrorState";
import MangaGrid from "../components/MangaGrid";

function LatestReleasePage() {
  const {
    mangas,
    initialLoading,
    initialError,
    retry,
  } = useMangaFeed({
    fetchFn: mangaApi.getLatestManga,
    limit: 50,
    mode: "static"
  });

  return (
    <div className="flex-1 pt-20 px-4">
      <ScrollToTopBtn />

      <PageHeader title="Latest Releases" />

      {initialError && (
        <ErrorState message={initialError} onRetry={retry} />
      )}

      <MangaGrid mangas={mangas} loading={initialLoading} />

      {!initialLoading && !initialError && mangas.length > 0 && (
        <p className="text-center text-gray-400 my-10">
          Showing latest chapter updates 👀
        </p>
      )}
    </div>
  );
}

export default LatestReleasePage;