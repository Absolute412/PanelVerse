import { useEffect, useState } from "react";
import { getMangaProgress, setMangaProgress } from "../utils/storageService";

export function useMangaProgress ({
    mangaId,
    chapterId,
    source,
    pages,
    activeIdx,
    mangaMeta,
    scrollToPage,
}) {
    const [didRestorePage, setDidRestorePage] = useState(false);

    useEffect(() => {
        setDidRestorePage(false);
    }, [mangaId, chapterId]);

    // Restore last read page
    useEffect(() => {
        if (!pages.length || didRestorePage) return;

        const parsed = getMangaProgress(mangaId);

        try {
            const savedCurrentChapterId = parsed?.currentChapterId || parsed?.chapterId;
            const savedChapterProgress = parsed?.chapters?.[chapterId];
            const sameChapter = savedCurrentChapterId === chapterId;

            const savedPage = Number(
                savedChapterProgress?.lastPage ?? parsed?.page
            );

            const hasValidPage = Number.isInteger(savedPage) &&
                savedPage >= 0 &&
                savedPage < pages.length;
            
            if (sameChapter && hasValidPage) {
                scrollToPage(savedPage, "auto")
            }
        } catch {
            // ignore broken data (storage already handles most of this anyway)
        } finally {
            setDidRestorePage(true);
        }
    }, [pages, didRestorePage, mangaId, chapterId, scrollToPage]);

    // Save Progress
    useEffect(() => {
        if (!didRestorePage) return;

        const parsed = getMangaProgress(mangaId);

        const chaptersProgress = parsed?.chapters && typeof parsed.chapters === "object"
            ? parsed.chapters
            : {};
        
        const updatedAt = Date.now();

        const existingTitle = typeof parsed?.title === "string"
            ? parsed?.title.trim()
            : "";

        const existingThumb = parsed?.imageThumb;
        const existingMedium = parsed?.imageMedium;

        const hasExistingThumb = typeof existingThumb === "string" && existingThumb !== "/placeholder.jpg";
        const hasExistingMedium = typeof existingMedium === "string" && existingMedium !== "/placeholder.jpg";

        chaptersProgress[chapterId] = {
            lastPage: activeIdx,
            totalPages: pages.length,
            completed: pages.length > 0 && activeIdx >= pages.length - 1,
            updatedAt,
        };

        setMangaProgress(mangaId, {
            ...parsed,
            currentChapterId: chapterId,
            chapterId,
            // Persist source so Continue Reading can open with the right backend source next time.
            source: source || parsed?.source || null,
            title: existingTitle || (
                typeof mangaMeta?.title === "string"
                    ? mangaMeta.title.trim()
                    : null
            ),
            imageThumb: hasExistingThumb
                ? existingThumb
                : mangaMeta?.imageThumb || "/placeholder.jpg",
            imageMedium: hasExistingMedium
                ? existingMedium
                : mangaMeta?.imageMedium || mangaMeta?.imageThumb || "/placeholder.jpg",
            page: activeIdx,
            updatedAt,
            chapters: chaptersProgress,
        });
    }, [didRestorePage, mangaId, chapterId, source, activeIdx, pages.length, mangaMeta]);
}
