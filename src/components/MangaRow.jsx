import { Icon } from "@iconify/react";
import Card from "./Card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function MangaRow({ title, apiUrl}) {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchMangas = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data && data.data) {
          const formatted = data.data.map((manga) => {
            const id = manga.id;
            const title =
              manga.attributes.title.en ||
              Object.values(manga.attributes.title)[0] ||
              "No title";

            const cover = manga.relationships.find(
              (rel) => rel.type === "cover_art"
            );
            const coverFileName = cover?.attributes?.fileName;
            const image = coverFileName
              ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.256.jpg`
              : "/placeholder.jpg";

            return { id, title, image };
          });

          setMangas(formatted);
        }
      } catch (err) {
        console.error("Error fetching manga:", err);
        setError("Failed to load manga");
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, [apiUrl]);

    if (loading) {
        return (
        <section className="py-12 px-6 bg-primary dark:bg-main-dark">
            <div className="flex justify-center items-center gap-2">
            <Icon icon="eos-icons:loading" className="text-3xl text-blue-400  dark:text-gray-600"/>
            <p className="text-center text-gray-700 dark:text-white">Loading popular manga...</p>
            </div>
        </section>
        );
    }

    if (error) {
        return (
        <section className="py-12 px-6 bg-primary dark:bg-main-dark">
            <p className="text-center text-red-500">{error}</p>
        </section>
        );
    }
    
    return(
        <section className="py-12 px-6 backdrop:blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <div className="flex items-center justify-center text-gray-600 hover:text-gray-700 cursor-pointer">
                        <p className="">See all</p>
                        <Icon icon="ic:round-navigate-next" />
                    </div>
                </div>

                <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
                    <div className="flex flex-row gap-4">
                        {mangas.map((manga) => (
                            <div key={manga.id} className="w-44 flex-none">
                                <Link to={`/manga/${manga.id}`}>
                                    <Card manga={manga} variant="row"/>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MangaRow
