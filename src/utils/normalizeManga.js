const getImageProxyBase = () => {
  // Keep this fallback aligned with src/api/manga.js so image URLs and API calls use the same backend.
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
  if (typeof apiBase === "string" && apiBase.trim()) {
    return apiBase.replace(/\/$/, "");
  }

  // Backward-compatible env: backend host without `/api` suffix.
  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL;
  if (typeof backendBase === "string" && backendBase.trim()) {
    return `${backendBase.replace(/\/$/, "")}/api`;
  }

  // Last-resort backend API path.
  return "http://localhost:5000/api";
};

const normalizeImageUrl = (raw) => {
  if (!raw) return "/placeholder.jpg";

  try {
    const parsed = new URL(raw, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const isRelativeProxyUrl = typeof raw === "string" && raw.startsWith("/api/image");
    const isLocalProxyHost =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1";

    // Rebuild only relative/local proxy URLs from backups; keep already-valid hosted URLs untouched.
    if (parsed.pathname === "/api/image" && (isRelativeProxyUrl || isLocalProxyHost)) {
      const source = parsed.searchParams.get("url");
      if (source) {
        const imageProxyBase = getImageProxyBase();
        return `${imageProxyBase}/image?url=${encodeURIComponent(source)}`;
      }
    }

    return parsed.toString();
  } catch {
    return raw;
  }
};

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
