import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { mangaApi } from "../api";

function timeAgo(dateString, now) {
  if (!dateString) return "Unknown";

  const past = new Date(dateString);
  const seconds = Math.floor((now - past.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function LatestRelease() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());
  const LIMIT = 10;

  useEffect(() => {
      const fetchManga = async () => {
        try {
          setLoading(true);
          setError(null);
    
          const data = await mangaApi.getLatestManga(LIMIT);
  
          setMangas(data);
        } catch (err) {
          console.error("Error fetching manga:", err);
          setError("Failed to load latest manga");
        } finally {
          setLoading(false);
        }
      }
  
      fetchManga();
    }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-6 bg-main dark:bg-main-dark">
        <div className="flex justify-center items-center gap-2">
          <Icon icon="eos-icons:loading" className="text-3xl text-blue-400 dark:text-gray-600"/>
          <p className="text-center text-gray-700 dark:text-white">Loading latest manga...</p>
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
              Latest Releases
            </span>
            <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
          </div>
          <Link to="/latest-release">
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

        <div className="h-full">
          <div className="
            grid grid-flow-row md:grid-flow-col 
            grid-cols-1 md:auto-cols-fr md:grid-rows-5 gap-4 "
          >
            {mangas.map((manga) => (
              <Link to={`/manga/${manga.id}`} key={manga.id}
                id={manga.id} 
                className="flex gap-3 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10 p-3 rounded-2xl backdrop-blur-md shadow-2xl hover:-translate-y-0.5 transition-transform">
                <img 
                  src={manga.imageThumb} 
                  alt={manga.title}
                  className="w-18 h-24 object-cover rounded-lg shrink-0 ring-1 ring-white/30 dark:ring-white/10"
                />

                <div className="flex flex-col justify-between w-full">
                  <h3 className="font-semibold line-clamp-2 text-gray-800 dark:text-white">
                    {manga.title}
                  </h3>

                  <div className="flex flex-row justify-between items-center">
                    <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full">
                      {manga.latestChapter || manga.lastChapter
                        ? `Ch. ${manga.latestChapter || manga.lastChapter || "-"}`
                        : "Oneshot / Special"}
                    </p>

                    <p className="text-[12px] font-semibold text-gray-600 dark:text-gray-300">
                      {timeAgo(manga.latestPublishedAt || manga.updatedAt, now)}
                    </p>
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

export default LatestRelease;
