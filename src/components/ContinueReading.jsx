import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { getContinueReadingItems } from "../utils/storageService";

const timeAgo = (value) => {
  if (!value) return "Recently";
  const now = Date.now();
  const seconds = Math.floor((now - value) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

function ContinueReading() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = () => {
      setItems(getContinueReadingItems(12));
    };

    loadItems();

    // Refresh rail when storage changes from another tab/window.
    window.addEventListener("storage", loadItems);
    return () => window.removeEventListener("storage", loadItems);
  }, []);

  if (!items.length) return null;

  return (
    <section className="bg-(--main) pt-12 px-6 backdrop-blur-sm">
      <div>
        <div className="flex items-center gap-3 w-full mb-6">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
            Continue Reading
          </span>
          <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
        </div>

        <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex flex-row gap-4 pb-2">
            {items.map((item) => {
              const pageLabel = item.totalPages > 0
                ? `Page ${Math.min(item.lastPage + 1, item.totalPages)}/${item.totalPages}`
                : `Page ${item.lastPage + 1}`;

              return (
                <Link
                  to={`/read/${item.mangaId}/${item.currentChapterId}`}
                  key={`${item.mangaId}-${item.currentChapterId}`}
                >
                  <div className="flex-none w-40 sm:w-50 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden transition-transform duration-300 backdrop-blur-md">
                    <div className="relative">
                      <img
                        src={item.imageMedium || item.imageThumb || "/placeholder.jpg"}
                        alt={item.title}
                        className="w-full h-42 sm:h-64 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-18 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    <div className="p-2 sm:p-4">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 bg-black/5 dark:bg-white/10 rounded-full px-2 py-1">
                          {pageLabel}
                        </span>

                        <span className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <Icon icon="mdi:clock-time-four-outline" className="text-sm" />
                          {timeAgo(item.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContinueReading;
