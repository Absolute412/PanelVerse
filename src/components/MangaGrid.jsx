import { Link } from "react-router-dom";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";

function MangaGrid({ mangas, loading }) {
  return (
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {mangas.map(manga => (
        <Link key={manga.id} to={`/manga/${manga.id}`}>
          <Card key={manga.id} manga={manga} />
        </Link>
      ))}

      {loading &&
        Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  );
}

export default MangaGrid;