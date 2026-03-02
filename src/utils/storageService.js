const STORAGE_SCHEMA_VERSION = 2;
const SCHEMA_KEY = "pv-schema-version";
const THEME_KEY = "theme";
const LIBRARY_KEY = "library";
const PROGRESS_PREFIX = "progress-";

const EMPTY_PROGRESS = {
  schemaVersion: STORAGE_SCHEMA_VERSION,
  currentChapterId: null,
  chapterId: null, // Legacy compatibility for older reads.
  // Metadata fallback for Continue Reading when manga is not in Library.
  title: null,
  imageThumb: "/placeholder.jpg",
  imageMedium: "/placeholder.jpg",
  page: 0,
  updatedAt: 0,
  chapters: {},
};

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

const safeParseJSON = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const getImageProxyBase = () => {
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
  if (typeof apiBase === "string" && apiBase.trim()) {
    return apiBase.replace(/\/$/, "");
  }

  const backendBase = import.meta.env.VITE_BACKEND_BASE_URL;
  if (typeof backendBase === "string" && backendBase.trim()) {
    return `${backendBase.replace(/\/$/, "")}/api`;
  }

  return "http://localhost:5000/api";
};

const normalizeImageUrl = (raw) => {
  if (!raw || typeof raw !== "string") return raw || "/placeholder.jpg";

  try {
    const parsed = new URL(raw, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const isRelativeProxyUrl = raw.startsWith("/api/image");
    const isLocalProxyHost =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1";

    if (parsed.pathname === "/api/image" && (isRelativeProxyUrl || isLocalProxyHost)) {
      const source = parsed.searchParams.get("url");
      if (!source) return raw;
      return `${getImageProxyBase()}/image?url=${encodeURIComponent(source)}`;
    }

    return parsed.toString();
  } catch {
    return raw;
  }
};

const normalizeLibraryEntry = (manga) => ({
  ...manga,
  imageThumb: normalizeImageUrl(manga?.imageThumb || manga?.image),
  imageMedium: normalizeImageUrl(manga?.imageMedium || manga?.image),
  imageFull: normalizeImageUrl(manga?.imageFull || manga?.image),
});

const getProgressKey = (mangaId) => `${PROGRESS_PREFIX}${mangaId}`;

const normalizeChapterProgress = (value) => {
  if (!value || typeof value !== "object") return null;

  const lastPage = Number(value.lastPage);
  const totalPages = Number(value.totalPages);
  const updatedAt = Number(value.updatedAt);

  return {
    lastPage: Number.isInteger(lastPage) && lastPage >= 0 ? lastPage : 0,
    totalPages: Number.isInteger(totalPages) && totalPages >= 0 ? totalPages : 0,
    completed: Boolean(value.completed),
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
  };
};

const normalizeProgress = (rawProgress) => {
  if (!rawProgress || typeof rawProgress !== "object") return { ...EMPTY_PROGRESS };

  const currentChapterId = rawProgress.currentChapterId || rawProgress.chapterId || null;
  // Normalize optional metadata saved from reader/manga page route state.
  const title = typeof rawProgress.title === "string" && rawProgress.title.trim()
    ? rawProgress.title.trim()
    : null;
  const imageThumb = normalizeImageUrl(rawProgress.imageThumb || rawProgress.image);
  const imageMedium = normalizeImageUrl(rawProgress.imageMedium || rawProgress.imageThumb || rawProgress.image);
  const page = Number(rawProgress.page);
  const updatedAt = Number(rawProgress.updatedAt);

  const normalized = {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    currentChapterId,
    chapterId: currentChapterId,
    title,
    imageThumb,
    imageMedium,
    page: Number.isInteger(page) && page >= 0 ? page : 0,
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : Date.now(),
    chapters: {},
  };

  // Keep only valid chapter progress records.
  if (rawProgress.chapters && typeof rawProgress.chapters === "object") {
    Object.entries(rawProgress.chapters).forEach(([chapterId, chapterProgress]) => {
      const value = normalizeChapterProgress(chapterProgress);
      if (value) normalized.chapters[chapterId] = value;
    });
  }

  // Migration path: older shape stored only one chapter/page at top-level.
  if (currentChapterId && !normalized.chapters[currentChapterId]) {
    normalized.chapters[currentChapterId] = {
      lastPage: normalized.page,
      totalPages: 0,
      completed: false,
      updatedAt: normalized.updatedAt,
    };
  }

  return normalized;
};

const getProgressEntries = () => {
  if (!isBrowser()) return [];

  const entries = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PROGRESS_PREFIX)) {
      const mangaId = key.slice(PROGRESS_PREFIX.length);
      entries.push([mangaId, key]);
    }
  }
  return entries;
};

const clearProgressEntries = () => {
  if (!isBrowser()) return;
  getProgressEntries().forEach(([, key]) => localStorage.removeItem(key));
};

export const ensureStorageSchema = () => {
  if (!isBrowser()) return;

  const storedVersion = Number(localStorage.getItem(SCHEMA_KEY) || 0);
  if (storedVersion >= STORAGE_SCHEMA_VERSION) return;

  // Schema v2 migration: normalize every progress-* record into one stable format.
  getProgressEntries().forEach(([, key]) => {
    const parsed = safeParseJSON(localStorage.getItem(key), null);
    const normalized = normalizeProgress(parsed);
    localStorage.setItem(key, JSON.stringify(normalized));
  });

  localStorage.setItem(SCHEMA_KEY, String(STORAGE_SCHEMA_VERSION));
};

export const getThemePreference = () => {
  ensureStorageSchema();
  if (!isBrowser()) return "light";
  const value = localStorage.getItem(THEME_KEY);
  return value === "dark" ? "dark" : "light";
};

export const setThemePreference = (theme) => {
  ensureStorageSchema();
  if (!isBrowser()) return;
  localStorage.setItem(THEME_KEY, theme === "dark" ? "dark" : "light");
};

export const getLibraryData = () => {
  ensureStorageSchema();
  if (!isBrowser()) return [];
  const parsed = safeParseJSON(localStorage.getItem(LIBRARY_KEY), []);
  const list = Array.isArray(parsed) ? parsed : [];
  const normalized = list.map(normalizeLibraryEntry);

  // Self-heal stale localhost proxy URLs found in imported backups.
  if (JSON.stringify(normalized) !== JSON.stringify(list)) {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(normalized));
  }

  return normalized;
};

export const setLibraryData = (library) => {
  ensureStorageSchema();
  if (!isBrowser()) return;
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(Array.isArray(library) ? library : []));
};

export const getMangaProgress = (mangaId) => {
  ensureStorageSchema();
  if (!isBrowser() || !mangaId) return { ...EMPTY_PROGRESS };
  const parsed = safeParseJSON(localStorage.getItem(getProgressKey(mangaId)), null);
  return normalizeProgress(parsed);
};

export const setMangaProgress = (mangaId, progress) => {
  ensureStorageSchema();
  if (!isBrowser() || !mangaId) return;
  const normalized = normalizeProgress(progress);
  localStorage.setItem(getProgressKey(mangaId), JSON.stringify(normalized));
};

export const getContinueReadingItems = (limit = 10) => {
  ensureStorageSchema();
  if (!isBrowser()) return [];

  const libraryMap = new Map(getLibraryData().map((manga) => [manga.id, manga]));

  const items = getProgressEntries()
    .map(([mangaId, key]) => {
      const parsed = safeParseJSON(localStorage.getItem(key), null);
      const progress = normalizeProgress(parsed);
      const currentChapterId = progress.currentChapterId;
      if (!currentChapterId) return null;

      const chapterProgress = progress.chapters?.[currentChapterId] || null;
      // If current chapter was fully completed, skip it from Continue Reading rail.
      if (chapterProgress?.completed) return null;

      const libraryItem = libraryMap.get(mangaId);
      const fallbackTitle = "Unknown title";

      const lastPage = Number(chapterProgress?.lastPage ?? progress.page ?? 0);
      const totalPages = Number(chapterProgress?.totalPages ?? 0);
      const updatedAt = Number(chapterProgress?.updatedAt ?? progress.updatedAt ?? 0);

      return {
        mangaId,
        // Prefer Library display data, then progress metadata, then safe fallbacks.
        title: libraryItem?.title || progress.title || fallbackTitle,
        imageThumb: libraryItem?.imageThumb || progress.imageThumb || "/placeholder.jpg",
        imageMedium: libraryItem?.imageMedium || libraryItem?.imageThumb || progress.imageMedium || progress.imageThumb || "/placeholder.jpg",
        currentChapterId,
        lastPage: Number.isInteger(lastPage) && lastPage >= 0 ? lastPage : 0,
        totalPages: Number.isInteger(totalPages) && totalPages >= 0 ? totalPages : 0,
        updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return items.slice(0, Math.max(1, limit));
};

export const exportStorageData = () => {
  ensureStorageSchema();
  const progress = {};

  if (isBrowser()) {
    getProgressEntries().forEach(([mangaId, key]) => {
      const parsed = safeParseJSON(localStorage.getItem(key), null);
      progress[mangaId] = normalizeProgress(parsed);
    });
  }

  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    theme: getThemePreference(),
    library: getLibraryData(),
    progress,
  };
};

export const importStorageData = (rawData) => {
  ensureStorageSchema();
  if (!isBrowser()) return { ok: false, error: "Storage is not available in this environment." };

  const parsed = typeof rawData === "string" ? safeParseJSON(rawData, null) : rawData;
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "Invalid backup file format." };
  }

  const hasKnownSections = "theme" in parsed || "library" in parsed || "progress" in parsed;
  if (!hasKnownSections) {
    return { ok: false, error: "Backup is missing theme/library/progress data." };
  }

  if ("theme" in parsed) setThemePreference(parsed.theme);
  if ("library" in parsed) setLibraryData(Array.isArray(parsed.library) ? parsed.library : []);

  if ("progress" in parsed) {
    clearProgressEntries();
    const progress = parsed.progress;
    if (progress && typeof progress === "object") {
      Object.entries(progress).forEach(([mangaId, value]) => {
        if (!mangaId) return;
        setMangaProgress(mangaId, value);
      });
    }
  }

  localStorage.setItem(SCHEMA_KEY, String(STORAGE_SCHEMA_VERSION));
  return { ok: true };
};
