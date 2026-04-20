import { useEffect, useState } from "react";
import { getChapterPages } from "../api/manga";

export  function useChapterPages(chapterId) {
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
                }

                const data = await getChapterPages(chapterId);

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

        if (chapterId) {
            fetchPages();
        }

        return () => {
            isMounted = false;
        };
    }, [chapterId]);

    return { pages, loading, error};
}