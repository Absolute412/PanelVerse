import { Link } from "react-router-dom";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";

function MangaGrid({ mangas, loading }) {
  const showSkeleton = loading && mangas.length === 0;

  return (
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {showSkeleton
        ? Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))
        : mangas.map(manga => (
          <Link key={manga.id} to={`/manga/${manga.id}`}>
            <Card manga={manga} variant="feed" />
          </Link>
        ))
      }
    </div>
  );
}

export default MangaGrid;