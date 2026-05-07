import { normalizeImageUrl } from "../utils/storageService"

export const normalizeManga = (manga) => ({
  id: manga.id,
  title: manga.title,

  imageThumb: normalizeImageUrl(manga.imageThumb || manga.image),
  imageMedium: normalizeImageUrl(manga.imageMedium || manga.image),
  imageFull: normalizeImageUrl(manga.imageFull || manga.image),

  author: manga.author || "unknown",
  description: manga.description || "",
  chapters: manga.chapters || [],
});
