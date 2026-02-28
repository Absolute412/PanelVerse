import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { mangaApi } from "../api";
import HorizontalMangaStripSkeleton from "./HorizontalMangaStripSkeleton";

function Popular() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LIMIT = 20;

  useEffect(() => {
    const fetchManga = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const data = await mangaApi.getPopularManga(LIMIT)

        setMangas(data);
      } catch (err) {
        console.error("Error fetching manga:", err);
        setError("Failed to load popular manga");
      } finally {
        setLoading(false);
      }
    }

    fetchManga();
  }, []);

  if (loading) {
    return (
      <section className="bg-main dark:bg-main-dark pt-12 px-6 backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 w-full">
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                Popular Manga
              </span>
              <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
            </div>
            <Link to="/popular">
              <div className="flex items-center cursor-pointer group shrink-0">
                <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 dark:text-white/80 dark:group-hover:text-white">
                  See all
                </p>
                <Icon
                  icon="ic:round-navigate-next"
                  className="text-gray-600 text-lg dark:text-white/80 group-hover:text-gray-800 dark:group-hover:text-white"
                />
              </div>
            </Link>
          </div>

          <HorizontalMangaStripSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6 bg-main dark:bg-main-dark">
        <p className="text-center text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-main dark:bg-main-dark pt-12 px-6 backdrop-blur-sm">
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 w-full">
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
              Popular Manga
            </span>
            <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
          </div>
          <Link to="/popular">
            <div className="flex items-center cursor-pointer group shrink-0">
              <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 dark:text-white/80 dark:group-hover:text-white">
                See all
              </p>
              <Icon
                icon="ic:round-navigate-next"
                className="text-gray-600 text-lg dark:text-white/80 group-hover:text-gray-800 dark:group-hover:text-white"
              />
            </div>
          </Link>
        </div>

        <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex flex-row gap-4 pb-2">
            {mangas.map((manga) => (
              <Link to={`/manga/${manga.id}`} key={manga.id}>
                <div className="
                      flex-none w-34 sm:w-60 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
                      rounded-2xl shadow-2xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden
                      transition-transform duration-300 backdrop-blur-md">
                  <div className="relative">
                    <img
                      src={manga.imageMedium}
                      alt={manga.title}
                      className="w-full h-42 sm:h-80 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {manga.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Popular;
