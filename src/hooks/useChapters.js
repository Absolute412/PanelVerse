import { useEffect, useState } from "react";
import { getAllChapters } from "../api/manga";

export function useChapters(mangaId, initialChapters = []) {
    const [chapters, setChapers] = useState(initialChapters);

    useEffect(() => {
        if (chapters.length > 0) return;

        const fetchChapters = async () => {
            try {
                const data = await getAllChapters(mangaId);
                setChapers(data);
            } catch (err) {
                console.error("Failed to fetch chapters", err);
            }
        };

        if (mangaId) {
            fetchChapters();
        }
    }, [chapters.length, mangaId]);

    return { chapters };
}