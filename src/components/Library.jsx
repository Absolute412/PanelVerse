import { useLibrary } from "../contexts/LibraryContext";
import Card from "./Card";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Library() {
    const {library} = useLibrary();

    return(
        <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
            <Navbar />

            <div className="flex-1">
                <div className="pt-20 pb-16 px-4 sm:px-6">
                    <div className="max-w-6xl">
                        <div className="flex items-center justify-between my-2">
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex flex-col ">
                                    <span className="text-[15px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                                    Library
                                </span>
                                <span className="text-[12px] font-light tracking-[0.2em] ">Your saved and downloaded manga</span>
                                </div>
                                <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                            </div>
                        </div>
                    </div>

                    {library.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">
                            Your library is empty. Add some manga to see them here.
                        </p>
                    ) : (
                        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {library.map((manga) => (
                                <Link to={`/manga/${manga.id}`}>
                                    <Card manga={manga} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Library