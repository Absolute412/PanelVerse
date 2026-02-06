export const normalizeManga = (manga) => ({
  id: manga.id,
  title: manga.title,

  imageThumb: manga.imageThumb || manga.image || "/placeholder.jpg",
  imageMedium: manga.imageMedium || manga.image || "/placeholder.jpg",
  imageFull: manga.imageFull || manga.image || "/placeholder.jpg",

  author: manga.author || "unknown",
  description: manga.description || "",
  chapters: manga.chapters || [],
});
