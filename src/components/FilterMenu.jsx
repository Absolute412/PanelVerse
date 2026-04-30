import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

const progressOptions = [
    { value: "all", label: "All titles", icon: "solar:book-bookmark-bold" },
    { value: "unread", label: "Not started", icon: "mdi:book-outline" },
    { value: "in-progress", label: "In progress", icon: "mdi:book-clock-outline" },
    { value: "completed", label: "Completed", icon: "mdi:book-check-outline" },
];

const sortOptions = [
    { value: "recently-added", label: "Recently added", icon: "mdi:history" },
    { value: "recently-read", label: "Recently read", icon: "mdi:book-refresh-outline" },
    { value: "alphabetical", label: "A to Z", icon: "mdi:sort-alphabetical-ascending" },
];

function FilterMenu({
    filters,
    setFilters,
    sortBy,
    setSortBy,
    activeCount = 0,
    resultCount = 0,
    totalCount = 0,
}) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("filter");

    const filterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleClear = () => {
        setFilters({ query: "", progress: "all" });
        setSortBy("recently-added");
    };

    return (
        <div
            ref={filterRef}
            className="relative"
        >
            <button 
                onClick={() => setFilterOpen((prev => !prev))}
                className="relative p-2.5 rounded-xl bg-(--component) hover:bg-(--component-hover) text-(--text-main) transition cursor-pointer"
                aria-label="Open filter and sort options"
            >
                <Icon icon="mynaui:filter-solid" className="text-lg" /> 
                {activeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-(--action) text-white text-[10px] font-bold leading-5 text-center">
                        {activeCount}
                    </span>
                )}
            </button>

            {filterOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-80 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-(--component) shadow-2xl backdrop-blur">
                    <div className="space-y-4">
                        <div 
                            className="
                            flex items-center gap-2 rounded-xl p-1 bg-(--component-hover)
                            text-xs font-semibold uppercase tracking-wide text-(--text-muted)"
                        >
                                <button
                                    onClick={() => setActiveTab("filter")}
                                    className={`flex-1 rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                                        activeTab === "filter"
                                            ? "bg-(--component) text-(--text-main)"
                                            : "hover:bg-(--component)/40"
                                    }`}
                                >
                                    Filter
                                </button>
                                <button
                                    onClick={() => setActiveTab("sort")}
                                    className={`flex-1 rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                                        activeTab === "sort"
                                            ? "bg-(--component) text-(--text-main)"
                                            : "hover:bg-(--component)/40"
                                    }`}
                                    >
                                    Sort
                                </button>
                        </div>

                        {activeTab === "filter" && (
                            <div className="space-y-3">
                                <label className="block">
                                    <span className="text-[11px] uppercase tracking-[0.14em] text-(--text-muted)">
                                        Search
                                    </span>
                                    <div className="relative mt-1.5">
                                        <Icon
                                            icon="mdi:magnify"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                                        />
                                        <input
                                            value={filters.query}
                                            onChange={(e) => handleFilterChange("query", e.target.value)}
                                            placeholder="Title or author"
                                            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-(--main) py-2 pl-9 pr-3 text-sm text-(--text-main) outline-none focus:ring-2 focus:ring-(--action)/40"
                                        />
                                    </div>
                                </label>

                                <div>
                                    <span className="text-[11px] uppercase tracking-[0.14em] text-(--text-muted)">
                                        Reading status
                                    </span>
                                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                                        {progressOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleFilterChange("progress", option.value)}
                                                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition cursor-pointer border ${
                                                    filters.progress === option.value
                                                        ? "border-(--action) bg-(--action)/20 text-(--text-main)"
                                                        : "border-black/10 dark:border-white/10 hover:bg-(--component-hover) text-(--text-muted)"
                                                }`}
                                            >
                                                <Icon icon={option.icon} className="text-sm shrink-0" />
                                                <span className="truncate">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "sort" && (
                            <div className="space-y-2">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSortBy(option.value)}
                                        className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition cursor-pointer border ${
                                            sortBy === option.value
                                                ? "border-(--action) bg-(--action)/20 text-(--text-main)"
                                                : "border-black/10 dark:border-white/10 hover:bg-(--component-hover) text-(--text-muted)"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Icon icon={option.icon} className="text-base" />
                                            <span>{option.label}</span>
                                        </span>
                                        {sortBy === option.value && (
                                            <Icon icon="mdi:check-bold" className="text-(--action)" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                            <span className="text-(--text-muted)">
                                Showing {resultCount} of {totalCount}
                            </span>
                            <button
                                onClick={handleClear}
                                className="text-(--action) font-semibold hover:opacity-80 transition cursor-pointer"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterMenu;
