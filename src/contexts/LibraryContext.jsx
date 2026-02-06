import { createContext, useContext, useEffect, useState } from "react"
import { normalizeManga } from "../utils/normalizeManga";

const LibraryContext = createContext();

export const LibraryProvider = ({children}) => {
    const [library, setLibrary] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("library")) || [];
            return saved.map(normalizeManga);
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("library", JSON.stringify(library))
    }, [library]);

    const addToLibrary = (manga) => {
        const normalized = normalizeManga(manga);
        setLibrary(prev => [...prev, normalized]);
    };

    const removeFromLibrary = (id) => {
        setLibrary(prev => prev.filter(m => m.id !== id));
    }

  return (
    <LibraryContext.Provider value={{library, addToLibrary, removeFromLibrary}}>
        {children}
    </LibraryContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLibrary = () => useContext(LibraryContext);