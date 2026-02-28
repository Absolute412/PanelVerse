
const Card = ({manga, onClick}) => {
    if(!manga) return null

  return (
    <div 
        onClick={onClick}
        className="
            flex-none w-full bg-white/35 dark:bg-black/30 border border-white/20 dark:border-white/10
            rounded-2xl shadow-2xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden
            transition-transform duration-300 backdrop-blur-md
        "
    >
        <div className="relative">
            <img 
                src={manga.imageMedium || manga.imageThumb || "/placeholder.jpg"}
                className="w-full h-42 sm:h-64 object-cover"
                loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        </div>
        <div className="p-4 flex items-center">
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {manga.title || "Unknown title"}
                </h3>
            </div>
        </div>
    </div>
  )
}

export default Card
