import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Card from "./Card";
import ScrollToTopBtn from "./ScrollToTopBtn";
import SkeletonCard from "./SkeletonCard";
import { mangaApi } from "../api";

function LatestReleasePage() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const LIMIT = 50;

  useEffect(() => {
    let active = true;

    const fetchLatest = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await mangaApi.getLatestManga(LIMIT);
        if (active) {
          setMangas(data);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("You're offline or the server is unreachable.");
          setMangas([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLatest();
    return () => (active = false);
  }, [refreshKey]);

  return (
    <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
      <Navbar />

      <div className="flex-1 pt-20 pb-16 px-4 sm:px-6">
        <ScrollToTopBtn />

        {/* Header */}
        <div className="max-w-6xl">
          <div className="flex items-center justify-between my-2">
            <div className="flex items-center gap-3 w-full">
              <span className="text-[15px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                Latest Releases
              </span>
              <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
              {/* Refresh */}
              <button
                onClick={() => setRefreshKey(k => k + 1)}
                disabled={loading}
                className="
                  flex items-center gap-1 px-3 py-1.5 text-sm rounded-md
                  bg-component dark:bg-component-dark hover:bg-primary/60
                  dark:hover:bg-component-hover-dark disabled:opacity-50 cursor-pointer"
              >
                {/* <Icon icon="material-symbols:refresh" /> */}
                Reload
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-red-500 text-center">{error}</p>
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && mangas.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
            No recent updates found
          </p>
        )}

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mx-auto">
          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}

          {!loading &&
            mangas.map(manga => (
              <Link key={manga.id} to={`/manga/${manga.id}`}>
                <Card manga={manga} />
              </Link>
            ))}
        </div>

        {/* End note */}
        {!loading && mangas.length > 0 && (
          <p className="text-center text-gray-400 text-xl mt-10">
            Showing recent updates only 👀
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default LatestReleasePage;
