import { mangaApi } from "../api";
import HorizontalMangaSection from "./HorizontalMangaSection";

function RecentlyAdded() {

  return (
    <HorizontalMangaSection 
      title="Recently Added"
      link="/recently-added"
      fetchManga={mangaApi.getRecentlyAddedManga}
      errorMessage="Failed to load recently added manga"
    />
  );
}

export default RecentlyAdded;
