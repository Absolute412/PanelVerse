function GeneralSettings ({
    backgroundColors,
    setBackgroundColors,
    progressBar,
    setProgressBar,
    progressBarPosition,
    setProgressBarPosition,
}) {
    const colors = [
        {id: "theme", label: "Theme"},
        {id: "black", label: "Black"},
        {id: "gray", label: "Gray"},
        {id: "white", label: "White"},
    ];

    const bars = [
        {id: "hidden", label:"Hidden"},
        {id: "standard", label:"Standard"},
    ];

    const positions = [
        {id: "bottom", label:"Bottom"},
        {id: "left", label:"Left"},
        {id: "right", label:"Right"},
    ];

    return (
        <section className="flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-(--text-main)">General settings</h2>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-(--text-main)">Background color</h2>

                {/* Background colors */}
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => setBackgroundColors(color.id)}
                            className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                                backgroundColors === color.id
                                ? "bg-(--component)"
                                : "border border-(--component) hover:bg-(--component)/30"
                            }`}
                        >
                            {color.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-(--text-main)">Progress bar style</h2>

                {/* Progress bar style */}
                <div className="flex flex-wrap gap-2">
                    {bars.map((bar) => (
                        <button
                            key={bar.id}
                            onClick={() => setProgressBar(bar.id)}
                            className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                                progressBar === bar.id
                                ? "bg-(--component)"
                                : "border border-(--component) hover:bg-(--component)/30"
                            }`}
                        >
                            {bar.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-(--text-main)">Progress bar position</h2>

                {/* Progress bar style */}
                <div className="flex flex-wrap gap-2">
                    {positions.map((position) => (
                        <button
                            key={position.id}
                            onClick={() => setProgressBarPosition(position.id)}
                            className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                                progressBarPosition === position.id
                                ? "bg-(--component)"
                                : "border border-(--component) hover:bg-(--component)/30"
                            }`}
                        >
                            {position.label}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default GeneralSettings;