import { Icon } from "@iconify/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { exportStorageData, importStorageData } from "../utils/storageService";
import { Logo } from "../components/Logo";

function Settings() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [backupStatus, setBackupStatus] = useState("");

    const handleBack = () => {
        navigate(-1);
    }

    const handleExportBackup = () => {
        // Export current local data as a downloadable JSON backup.
        const backup = exportStorageData();
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: "application/json",
        });

        const today = new Date().toISOString().slice(0, 10);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `panelverse-backup-${today}.json`;
        anchor.click();
        URL.revokeObjectURL(url);

        setBackupStatus("Backup exported successfully.");
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportBackup = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Read JSON text and restore theme, library, and progress.
            const text = await file.text();
            const result = importStorageData(text);

            if (!result.ok) {
                setBackupStatus(result.error || "Import failed.");
                return;
            }

            setBackupStatus("Backup imported. Reloading to apply changes...");
            window.setTimeout(() => window.location.reload(), 500);
        } catch {
            setBackupStatus("Could not read backup file.");
        } finally {
            // Allow selecting the same file again in future imports.
            event.target.value = "";
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-(--main)">
            <Navbar />

            <main className="flex-1 items-center pt-20">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 w-full my-2">
                        <button 
                            onClick={handleBack} 
                            className="
                            p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 
                            hover:bg-gray-200/60 dark:hover:bg-gray-500/40 transition cursor-pointer"
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

                    <div>
                        <div className="py-4">
                            <div 
                                className="
                                w-full flex items-center justify-between bg-white/35 dark:bg-black/30 
                                border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl 
                                hover:-translate-y-0.5 transition-transform backdrop-blur-md p-4"
                            >
                                <div className="flex items-center gap-2">
                                    <Logo size={36} />
                                    <div className="text-left">
                                        <p className="font-extrabold text-lg text-gray-800 dark:text-white tracking-tight">PanelVerse</p>
                                        <p className="text-sm text-black/60 dark:text-white/60">Your local manga reader experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pb-10">
                        <Link 
                            to="/library" 
                            className="
                            w-full flex items-center justify-between bg-white/35 dark:bg-black/30 
                            border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl 
                            hover:-translate-y-0.5 transition-transform backdrop-blur-md p-4 cursor-pointer"
                        >
                            <p className="text-base font-semibold text-gray-800 dark:text-white">Library</p>
                            <Icon 
                                icon="ic:round-navigate-next" 
                                className="text-xl text-gray-400" 
                            />
                        </Link>

                        <div 
                            className="
                            w-full flex items-center justify-between bg-white/35 dark:bg-black/30 
                            border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl 
                            hover:-translate-y-0.5 transition-transform backdrop-blur-md p-4 cursor-pointer"
                        >
                            <p className="text-base font-semibold text-gray-800 dark:text-white">Reader</p>
                            <Icon 
                                icon="ic:round-navigate-next" 
                                className="text-xl text-gray-400" 
                            />
                        </div>

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

                        <div 
                            className="
                            w-full bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10 
                            rounded-2xl shadow-2xl backdrop-blur-md p-4"
                        >
                            <p className="text-base font-semibold text-gray-800 dark:text-white">Backup & Restore</p>
                            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                                Export your local progress/library, or import a previous backup JSON.
                            </p>

                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                <button
                                    type="button"
                                    onClick={handleExportBackup}
                                    className="
                                    w-full sm:w-auto px-4 py-2 rounded-lg font-semibold 
                                    text-white bg-(--action) hover:bg-(--action-hover) cursor-pointer"
                                >
                                    Export Backup
                                </button>

                                <button
                                    type="button"
                                    onClick={handleImportClick}
                                    className="
                                    w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-gray-900 dark:text-white
                                    bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 cursor-pointer"
                                >
                                    Import Backup
                                </button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,application/json"
                                onChange={handleImportBackup}
                                className="hidden"
                            />

                            {backupStatus && (
                                <p className="text-xs text-black/70 dark:text-white/70 mt-3">{backupStatus}</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Settings
