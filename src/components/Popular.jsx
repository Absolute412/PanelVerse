import { mangaApi } from "../api";
import HorizontalMangaSection from "./HorizontalMangaSection";

function Popular() {

  return (
    <HorizontalMangaSection 
      title="Popular Manga"
      link="/popular"
      fetchManga={mangaApi.getPopularManga}
      errorMessage="Failed to load popular manga"
    />
  );
}

export default Popular;
