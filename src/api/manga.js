// Base URL for backend API. Trim trailing slash so endpoint joins are stable.
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000/api").replace(/\/$/, "");

// Shared fetch wrapper so all calls fail consistently on non-2xx responses.
const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json();
};

export const searchManga = async (query, limit = 20) => {
  // Avoid hitting backend for empty input.
  if (!query || query.trim() === "") return [];
  const url = `${API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  return fetchJson(url);
};

export const getLatestManga = async (limit = 20) => {
  const url = `${API_BASE}/latest?limit=${limit}`;
  return fetchJson(url);
};

export const getPopularManga = async (limit = 20, offset = 0) => {
  const url = `${API_BASE}/popular?limit=${limit}&offset=${offset}`;
  return fetchJson(url);
};

export const getRecentlyAddedManga = async (limit = 20, offset = 0) => {
  const url = `${API_BASE}/recently-added?limit=${limit}&offset=${offset}`;
  return fetchJson(url);
};

export const getManga = async (mangaId) => {
  // Single manga detail used by Manga page.
  const url = `${API_BASE}/manga/${mangaId}`;
  return fetchJson(url);
};

export const getAllChapters = async (mangaId) => {
  // Full chapter list for manga detail + reader navigation.
  const url = `${API_BASE}/manga/${mangaId}/chapters`;
  return fetchJson(url);
};

export const getChapterPages = async (chapterId) => {
  // Page image list for reader view.
  const url = `${API_BASE}/chapter/${chapterId}/pages`;
  return fetchJson(url);
};
