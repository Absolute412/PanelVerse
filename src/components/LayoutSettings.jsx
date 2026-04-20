function LayoutSettings ({ 
    readingMode,
    setReadingMode,
    displayMode,
    setDisplayMode,
    direction,
    setDirection,
}) {
    const modes = [
        { id: "single", label: "Single Page" },
        { id: "continuous", label: "Continuous Vertical" },
    ];
    
    const directions = [
        { id: "ltr", label: "Left To Right" },
        { id: "rtl", label: "Right To Left" },
    ];

    const scales = [
        { id: "original", label: "Original Size" },
        { id: "width", label: "Fit Width" },
        { id: "screen", label: "Fit Screen" },
    ];

    return (
        <section className="flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-(--text-main)">
                    Page Display Style
                </h2>
                <p className="text-sm text-(--text-muted)">Choose how pages are rendered.</p>
            </div>

            {/* Reading mode */}
            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-(--text-main)">Reading mode</h2>

                <div className="flex flex-wrap gap-2">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setReadingMode(mode.id)}
                            className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                                readingMode === mode.id
                                ? "bg-(--component)"
                                : "border border-(--component) hover:bg-(--component)/30"
                            }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reading direction */}
            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-(--text-main)">Reading direction</h2>

                <div className="flex flex-wrap gap-2">
                    {directions.map((dir) => (
                        <button
                            key={dir.id}
                            onClick={() => setDirection(dir.id)}
                            className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                                direction === dir.id
                                ? "bg-(--component)"
                                : "border border-(--component) hover:bg-(--component)/30"
                            }`}
                        >
                            {dir.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scale type */}
            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-(--text-main)">Scale Type</h2>

                <div className="flex flex-wrap gap-2">
                    {scales.map((scale) => (
                        <button
                            key={scale.id}
                            onClick={() => setDisplayMode(scale.id)}
                            className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                                displayMode === scale.id
                                ? "bg-(--component)"
                                : "border border-(--component) hover:bg-(--component)/30"
                            }`}
                        >
                            {scale.label}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LayoutSettings;