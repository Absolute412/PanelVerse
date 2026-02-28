import { useEffect, useRef, useState } from "react"
import { Icon } from '@iconify/react'
import { mangaApi } from "../api";
import { Link } from "react-router-dom";

const NavSearch = ({ variant = "desktop", onClose }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() =>
      setDebouncedTerm(searchTerm), 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedTerm) {
      setMangas([]);
      return;
    }

    let active = true;
    const fetchManga = async () => {
      setLoading(true);
      try {
        const data = await mangaApi.searchManga(debouncedTerm, 10); // limit 10 for dropdown
        if (active) setMangas(data);
      } catch (err) {
        console.error("Failed to fetch manga:", err);
        if (active) setMangas([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchManga();
    return () => (active = false);
  }, [debouncedTerm]);

  // ---------------- Click outside closes the dropdown ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  if (variant === "desktop") {
    return (
      <div ref={searchRef} className="relative w-full max-w-md">
        <div className="flex items-center gap-1 bg-main dark:bg-component-dark rounded-lg px-3 py-1 shadow-sm w-full">
            <Icon icon="ep:search" className="text-slate-600 dark:text-gray-300"/>
            <input
                type="text" 
                value={searchTerm}
                placeholder="Search manga..."
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setOpen(true)
                }}
                className="flex-1 bg-transparent dark:text-gray-200 placeholder-slate-600 outline-none"
            />
        </div>

        {open && searchTerm && (
          <div className="
              absolute left-0 mt-2 w-full bg-component dark:bg-component-dark rounded-lg
              shadow-lg max-h-80 overflow-y-auto custom-scrollbar z-50"
          >
            {loading ? (
              <p className="dark:text-gray-200">Loadng...</p>
            ) : mangas.length > 0 ? (
              mangas.map((manga) => (
                <Link
                  key={manga.id}
                  to={`/manga/${manga.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-component-light-hover dark:hover:bg-component-hover-dark cursor-pointer"
                >
                  <img 
                    src={manga.imageThumb}
                    alt={manga.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{manga.title}</p>
                </Link>
              ))
            ) : (
              <p className="p-3 text-gray-500 text-sm">No manga found</p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="ep:search" className="text-slate-600 dark:text-gray-300"/>
          <input
              type="text" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setOpen(true)
              }}
              placeholder="Search manga..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none items-center justify-center"
              autoFocus
          />
          <button onClick={onClose}>
            <Icon icon="mdi:close" className="text-white text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : mangas.length > 0 ? (
            mangas.map((manga) => (
              <Link 
                  key={manga.id}
                  to={`/manga/${manga.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-2 py-3 text-white hover:bg-white/10 rounded-lg"
              >
                <img 
                  src={manga.imageThumb}
                  alt={manga.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <span className="line-clamp-3 text-sm">{manga.title}</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-300 text-center mt-10">No results found</p>
          )}
        </div>
    </div>
  )
}

export default NavSearch