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
  return lower.includes("oneshot") || lower.includes("one-shot") || lower.includes("one shot");
};

export const getChapterBadge = (chapter) => {
  const number = cleanText(chapter?.number);
  const title = cleanText(chapter?.title);

  if (isMissingNumber(number)) {
    return isOneshotText(title) ? "OS" : "?";
  }

  if (isOneshotText(number)) return "OS";

  return number;
};

export const getChapterTitle = (chapter) => {
  const title = cleanText(chapter?.title);
  if (title) return title;

  const badge = getChapterBadge(chapter);
  if (badge === "OS") return "Oneshot";
  if (badge && badge !== "?") return `Chapter ${badge}`;
  return "Chapter ?";
};

export const getChapterLabel = (chapter) => {
  const badge = getChapterBadge(chapter);
  if (badge === "OS") return "Oneshot";
  if (badge && badge !== "?") return `Chapter ${badge}`;

  const title = cleanText(chapter?.title);
  return title || "Chapter ?";
};
