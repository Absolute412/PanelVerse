import { useEffect, useState } from "react";
import { getAllChapters } from "../api/manga";

export function useChapters(mangaId, initialChapters = []) {
    const [chapters, setChapters] = useState(initialChapters);
    // If we do not have route chapters yet, start in loading state immediately.
    const [loading, setLoading] = useState(() => Boolean(mangaId) && initialChapters.length === 0);

    useEffect(() => {
        // Re-seed when navigating to another manga route.
        setChapters(initialChapters);
        setLoading(Boolean(mangaId) && initialChapters.length === 0);
    }, [mangaId]);

    useEffect(() => {
        let isMounted = true;

        const fetchChapters = async () => {
            try {
                if (isMounted) setLoading(true);
                const data = await getAllChapters(mangaId);
                if (isMounted) {
                    setChapters(data);
                }
            } catch (err) {
                console.error("Failed to fetch chapters", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (mangaId) {
            // Always refresh from API so route state does not become stale.
            fetchChapters();
        }

        return () => {
            isMounted = false;
        };
    }, [mangaId]);

    return { chapters, loading };
}
