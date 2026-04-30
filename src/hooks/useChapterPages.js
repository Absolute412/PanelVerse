import { useEffect, useState } from "react";
import { getChapterPages } from "../api/manga";

export  function useChapterPages(chapterId, source) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPages = async () => {
            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                    setPages([]);
                }

                const data = await getChapterPages(chapterId, source);

                if (isMounted) {
                    setPages(data);
                }
            } catch {
                if (isMounted) {
                    setError("Failed to load chapter pages");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // Do not fetch pages until both chapter ID and resolved source are available.
        if (chapterId && source) {
            fetchPages();
        } else if (isMounted) {
            setLoading(false);
            setPages([]);
        }

        return () => {
            isMounted = false;
        };
    }, [chapterId, source]);

    return { pages, loading, error};
}
