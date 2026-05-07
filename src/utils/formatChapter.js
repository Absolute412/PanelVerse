const cleanText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const isMissingNumber = (value) => {
  const num = cleanText(value);
  return num === "" || num === "-" || num === "—" || num === "?";
};

const isOneshotText = (text) => {
  const lower = cleanText(text).toLowerCase();
  return (
    lower.includes("oneshot") || 
    lower.includes("one-shot") || 
    lower.includes("one shot") ||
    lower === "os" ||
    lower === "special" ||
    lower === "extra"
  );
};

const isPlaceholderChapterTitle = (text) => {
  const value = cleanText(text).toLowerCase();
  return value === "chapter ?" || value === "ch. ?";
};

const extractChapterNumberFromText = (text) => {
  const value = cleanText(text);
  if (!value) return null;

  const match =
    value.match(/\bchapter\s*[:#-]?\s*([\d.]+)/i) ||
    value.match(/\bch(?:apter)?\.?\s*[:#-]?\s*([\d.]+)/i) ||
    value.match(/\bep(?:isode)?\.?\s*[:#-]?\s*([\d.]+)/i) ||
    value.match(/#\s*([\d.]+)/) ||
    value.match(/(\d+(?:\.\d+)?)/);

  return match?.[1] || null;
};

export const getChapterBadge = (chapter) => {
  const number = cleanText(chapter?.number);
  const title = cleanText(chapter?.title);

  if (isOneshotText(title) || isOneshotText(number)) {
    return "OS";
  }

  if (isMissingNumber(number)) {
    const fromTitle = extractChapterNumberFromText(title);
    if (fromTitle) return fromTitle;

    return "1";
  }

  return number;
};

export const getChapterTitle = (chapter) => {
  const title = cleanText(chapter?.title);
  if (title && !isPlaceholderChapterTitle(title)) return title;

  const badge = getChapterBadge(chapter);
  if (badge === "OS") return "Chapter Oneshot";
  if (badge && badge !== "?") return `Chapter ${badge}`;
  return "Chapter 1";
};

export const getChapterLabel = (chapter) => {
  const badge = getChapterBadge(chapter);
  if (badge === "OS") return "Chapter Oneshot";
  if (badge && badge !== "?") return `Chapter ${badge}`;

  const title = cleanText(chapter?.title);
  if (title && !isPlaceholderChapterTitle(title)) return title;
  return "Chapter 1";
};
