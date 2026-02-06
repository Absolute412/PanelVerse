import { Icon } from "@iconify/react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }
    
    return (
        <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
            <Navbar />

            <main className="flex-1 items-center pt-20">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 w-full my-2">
                        <button 
                            onClick={handleBack} 
                            className="
                                p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 
                                hover:bg-gray-200/60 dark:hover:bg-gray-500/40 transition cursor-pointer
                            "
                            aria-label="Go back"
                        >
                            <Icon icon="eva:arrow-back-fill"/>
                        </button>
                        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black/70 dark:text-white/70">
                            Settings
                        </span>
                        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                    </div>

                    <p className="text-sm text-black/60 dark:text-white/60 mt-2">
                        Manage your preferences
                    </p>

                    <Link to="">
                        <div className="py-4">
                            <button 
                                className="
                                    w-full flex items-center justify-between bg-white/35 dark:bg-black/30 
                                    border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl 
                                    hover:-translate-y-0.5 transition-transform backdrop-blur-md p-4 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="
                                            p-2 rounded-full text-gray-800 
                                            dark:text-gray-200 bg-black/5 dark:bg-white/10"
                                    >
                                        <Icon icon="iconamoon:profile" className="object-cover text-2xl"/>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800 dark:text-white">Guest Account</p>
                                        <p className="text-sm text-black/60 dark:text-white/60">Sign in to sync reading progress</p>
                                    </div>
                                </div>
                                <Icon icon="ic:round-navigate-next" className="text-xl text-gray-400" />
                            </button>
                        </div>
                    </Link>

                    <div className="space-y-3 pb-10">
                        <Link 
                            to="/profile" 
                            className="
                                w-full flex items-center justify-between bg-white/35 dark:bg-black/30 
                                border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl 
                                hover:-translate-y-0.5 transition-transform backdrop-blur-md p-4 cursor-pointer"
                        >
                            <p className="text-base font-semibold text-gray-800 dark:text-white">Edit profile</p>
                            <Icon icon="ic:round-navigate-next" className="text-xl text-gray-400" />
                        </Link>

                        {/* <ToggleButton /> */}

                        <Link 
                            to="/library" 
                            className="
                                w-full flex items-center justify-between bg-white/35 dark:bg-black/30 
                                border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl 
                                hover:-translate-y-0.5 transition-transform backdrop-blur-md p-4 cursor-pointer"
                        >
                            <p className="text-base font-semibold text-gray-800 dark:text-white">Library</p>
                            <Icon icon="ic:round-navigate-next" className="text-xl text-gray-400" />
                        </Link>

                        <Link 
                            to="/about" 
                            className="
                                w-full flex items-center justify-between bg-white/35 dark:bg-black/30 
                                border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl 
                                hover:-translate-y-0.5 transition-transform backdrop-blur-md p-4 cursor-pointer"
                        >
                            <p className="text-base font-semibold text-gray-800 dark:text-white">About</p>
                            <Icon icon="ic:round-navigate-next" className="text-xl text-gray-400" />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Settings
