import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Icon } from "@iconify/react";
import HONORED from "../assets/img/honoured one.jpeg"

function Profile() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const user = {
        name: "Random Guy.",
        handle: "@inkbound",
        bio: "Shonen lifer. Slice-of-life on weekends. Chasing clean panels and cozy arcs.",
        location: "Brooklyn, NY",
        memberSince: "Aug 2023",
        avatar: HONORED,
        stats: [
            { label: "Chapters Read", value: "2,184" },
            { label: "Series Followed", value: "128" },
            { label: "Reading Streak", value: "17 days" },
            { label: "Reviews", value: "64" },
        ],
        badges: [
            { label: "Night Owl Reader", icon: "mdi:weather-night" },
            { label: "Top Reviewer", icon: "mdi:star-circle" },
            { label: "100+ Series", icon: "mdi:bookshelf" },
        ],
        currentlyReading: [
            { title: "Kaiju No. 8", progress: 68, icon: "mdi:book-open-page-variant" },
            { title: "Sakamoto Days", progress: 42, icon: "mdi:book-open-page-variant" },
            { title: "Blue Box", progress: 81, icon: "mdi:book-open-page-variant" },
        ],
        favorites: ["Action", "Mystery", "Slice of Life", "Romance"],
    };

    return(
        <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
            <Navbar />

            <div className="flex-1 pt-20  dark:bg-main-dark">
                <div className="flex items-center gap-3 w-full max-w-6xl mx-auto px-4 md:px-1 sm:px-6 my-2">
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
                        Profile
                    </span>
                    <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
                </div>
                <div className="px-4 sm:px-6 md:px-10 pb-10">
                    <div className="
                        relative overflow-hidden rounded-3xl bg-linear-to-br from-main via-component to-primary 
                        dark:from-primary-dark dark:via-main-dark dark:to-component-dark border border-black/5 dark:border-white/10 shadow-xl"
                    >
                        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-action-light-alt/30 blur-2xl dark:bg-action-dark/30"/>
                        <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-primary/30 blur-2xl dark:bg-action-dark-hover/30"/>

                        <div className="relative p-5 sm:p-7 md:p-10">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-20 w-20 rounded-2xl bg-component dark:bg-component-dark p-1.5 shadow-lg">
                                        <img
                                            src={user.avatar}
                                            alt={`${user.name} avatar`}
                                            className="h-full w-full rounded-xl object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{user.handle}</p>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                            {user.name}
                                        </h1>
                                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <span className="flex items-center gap-1">
                                                <Icon icon="mdi:map-marker-outline" />
                                                {user.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Icon icon="mdi:calendar-month-outline" />
                                                Member since {user.memberSince}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user.favorites.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-full text-xs font-semibold bg-component-light-hover text-gray-700 dark:bg-component-hover-dark dark:text-gray-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="mt-5 text-sm sm:text-base text-gray-700 dark:text-gray-200 max-w-2xl">
                                {user.bio}
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 shadow-sm dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100">
                                <Icon icon="mdi:information-outline" className="text-sm" />
                                Mock profile data for now
                            </div>

                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {user.stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-2xl bg-component dark:bg-component-dark p-4 border border-black/5 dark:border-white/10"
                                    >
                                        <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
                                <div className="lg:col-span-2 rounded-2xl bg-component dark:bg-component-dark p-5 border border-black/5 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Currently Reading</h2>
                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">Last 7 days</span>
                                    </div>
                                    <div className="mt-4 flex flex-col gap-4">
                                        {user.currentlyReading.map((item) => (
                                            <div key={item.title} className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-component-light-hover dark:bg-component-hover-dark flex items-center justify-center">
                                                    <Icon icon={item.icon} className="text-xl text-gray-700 dark:text-gray-200" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.progress}%</p>
                                                    </div>
                                                    <div className="mt-1 h-2 w-full rounded-full bg-component-light-hover dark:bg-component-hover-dark overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-linear-to-r from-action-light-alt to-action dark:from-action to-hero-action"
                                                            style={{ width: `${item.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-component dark:bg-component-dark p-5 border border-black/5 dark:border-white/10">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Badges</h2>
                                    <div className="mt-4 flex flex-col gap-3">
                                        {user.badges.map((badge) => (
                                            <div
                                                key={badge.label}
                                                className="flex items-center gap-3 rounded-xl bg-component-light-hover dark:bg-component-hover-dark px-3 py-2"
                                            >
                                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-component dark:bg-component-dark">
                                                    <Icon icon={badge.icon} className="text-lg text-gray-700 dark:text-gray-200" />
                                                </span>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{badge.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Profile
