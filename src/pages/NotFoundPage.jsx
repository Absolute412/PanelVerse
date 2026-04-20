import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 
                className="
                text-[120px] sm:text-[160px] font-extrabold leading-none bg-linear-to-b 
                from-gray-800 to-gray-400 dark:from-white dark:to-gray-500 bg-clip-text text-transparent"
            >
                404
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-(--text-muted)">
                This page got lost in another dimension.
            </p>

            <p className="mt-2 text-sm text-(--text-muted)/80">
                The page you’re looking for doesn’t exist or was moved.
            </p>

            <Link
                to="/"
                className="`
                mt-6 px-6 py-3 rounded-xl bg-(--action) hover:bg-(--action-hover) 
                text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
                Return to PanelVerse
            </Link>
        </div>
    );
}

export default NotFound;