import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Icon } from "@iconify/react";

function About() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    return(
        <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
            <Navbar />

            <div className="flex-1 pt-20 pb-16 px-4 sm:px-6 ">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 w-full my-2">
                        <button 
                            onClick={handleBack} 
                            className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400 transition cursor-pointer"
                            aria-label="Go back"
                        >
                            <Icon icon="eva:arrow-back-fill"/>
                        </button>
                        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                            Back
                        </span>
                        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                    </div>

                    <div className="mt-6 bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-md shadow-2xl p-6 sm:p-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            About PanelVerse
                        </h1>
                        <p className="text-black/70 dark:text-white/70 leading-relaxed mt-4">
                            PanelVerse is a lightweight manga reader built with React and Tailwind CSS. 
                            Our goal is simple: give readers a clean, fast, and ad-free place to discover and enjoy their favorite stories - from timeless classics to the latest releases.
                        </p>
                        <p className="text-black/70 dark:text-white/70 leading-relaxed mt-4">
                            We do not host content. We connect you to publicly available sources and help you
                            keep track of what you love, across any device.
                        </p>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default About
