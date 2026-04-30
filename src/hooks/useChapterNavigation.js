import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getChapterLabel } from "../utils/formatChapter";

export function useChapterNavigation({
    mangaId,
    chapterId,
    chapters = [],
    routeState,
}) {
    const navigate = useNavigate();

    // Find current index
    const currentIndex = useMemo(() => {
        return chapters.findIndex(
            (ch) => String(ch.id) === String(chapterId)
        );
    }, [chapters, chapterId]);

    // Current / prev / next chapters
    const currentChapter = currentIndex !== -1 ? chapters[currentIndex] : null;

    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

    const nextChapter =currentIndex !== -1 && currentIndex < chapters.length - 1
        ? chapters[currentIndex + 1]
        : null;
    const chapterLabel = currentChapter
        ? getChapterLabel(currentChapter)
        : "";

    // Navigation helpers
    const goToChapter = useCallback((chapter) => {
        if (!chapter) return;

        navigate(`/read/${mangaId}/${chapter.id}`, {
            state: routeState,
        });
    }, [navigate, mangaId, routeState]);

    const goNextChapter = useCallback(() => {
        if (!nextChapter) return;
        goToChapter(nextChapter);
    }, [nextChapter, goToChapter]);

    const goPrevChapter = useCallback(() => {
        if (!prevChapter) return;
        goToChapter(prevChapter);
    }, [prevChapter, goToChapter]);

    return {
        currentIndex,
        currentChapter,
        prevChapter,
        nextChapter,
        chapterLabel,
        goNextChapter,
        goPrevChapter,
        goToChapter,
    };
}
