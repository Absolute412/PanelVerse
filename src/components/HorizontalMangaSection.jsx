import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import HorizontalMangaStripSkeleton from "./HorizontalMangaStripSkeleton";
import Card from "./Card";

function HorizontalMangaSection({
  title,
  link,
  fetchManga, // function from api
  limit = 20,
  errorMessage = "Failed to load manga",
}) {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchManga(limit);
        setMangas(data);
      } catch (err) {
        console.error(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchManga, limit, errorMessage]);

  // Loading state
  if (loading) {
    return (
      <section className="bg-(--main) pt-12 px-6 backdrop-blur-sm">
        <div>
          <Header title={title} link={link} />

          <HorizontalMangaStripSkeleton />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 px-6 bg-(--main)">
        <p className="text-center text-red-500">{error}</p>
      </section>
    );
  }

  // Success state
  return (
    <section className="bg-(--main) px-6">
      <div>
        <Header title={title} link={link} />

        <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex flex-row gap-4 pb-2">
            {mangas.map((manga) => (
              <Link 
                to={`/manga/${manga.id}`} 
                key={manga.id} 
                className="flex-none w-34 sm:w-58"
              >
                <Card manga={manga} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// small reusable header inside the component
function Header({ title, link }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3 w-full">
        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-(--text-main)/70">
          {title}
        </span>
        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
      </div>

      <Link to={link}>
        <div className="flex items-center cursor-pointer group shrink-0">
          <p className="text-sm font-semibold text-(--text-main)/70 hover:text-(--text-muted)">
            See all
          </p>
          <Icon
            icon="ic:round-navigate-next"
            className="text-(--text-main)/70 hover:text-(--text-muted)"
          />
        </div>
      </Link>
    </div>
  );
}

export default HorizontalMangaSection;