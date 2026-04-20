import { useEffect, useState } from "react";

const defaults = {
  readingMode: "single",
  displayMode: "original",
  direction: "ltr",
  backgroundColors: "theme",
  progressBar: "standard",
  progressBarPosition: "bottom",
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("readerSettings"));
    return {
      readingMode: saved?.readingMode || defaults.readingMode,
      displayMode: saved?.displayMode || defaults.displayMode,
      direction: saved?.direction || defaults.direction,
      backgroundColors: saved?.backgroundColors || defaults.backgroundColors,
      progressBar: saved?.progressBar || defaults.progressBar,
      progressBarPosition: saved?.progressBarPosition || defaults.progressBarPosition
    };
  } catch {
    return defaults;
  }
}

export function useReaderSettings() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem("readerSettings", JSON.stringify(settings));
  }, [settings]);

  return {
    ...settings,
    setReadingMode: (v) => setSettings((s) => ({ ...s, readingMode: typeof v === "function" ? v(s.readingMode) : v })),
    setDisplayMode: (v) => setSettings((s) => ({ ...s, displayMode: typeof v === "function" ? v(s.displayMode) : v })),
    setDirection: (v) => setSettings((s) => ({ ...s, direction: typeof v === "function" ? v(s.direction) : v })),
    setBackgroundColors: (v) => setSettings((s) => ({ ...s, backgroundColors: typeof v === "function" ? v(s.backgroundColors) : v} )),
    setProgressBar: (v) => setSettings((s) => ({ ...s, progressBar: typeof v === "function" ? v(s.progressBar) : v} )),
    setProgressBarPosition: (v) => setSettings((s) => ({ ...s, progressBarPosition: typeof v === "function" ? v(s.progressBarPosition) : v} )),
  };
}
