
import { Icon } from "@iconify/react";
import { useLibrary } from "../contexts/LibraryContext"

export const AddButton = ({manga}) => {
    const {addToLibrary, removeFromLibrary, library} = useLibrary();
    const isInLibrary = library.some(item => item.id === manga.id);
    
    if (!manga) return null;

  return (
    <button 
        onClick={() => 
            isInLibrary ? removeFromLibrary(manga.id) : addToLibrary(manga)
        }
        className="
            px-4 py-2 rounded-md font-semibold bg-black/10 dark:bg-white/10 text-black 
            dark:text-white hover:bg-black/20 dark:hover:bg-white/20 flex items-center gap-2 cursor-pointer
        "
    >
        <Icon icon={isInLibrary ?  "ic:round-bookmark-remove" : "ic:round-bookmark-add"} />
        {isInLibrary ?  "Remove from Library" : "Add to Library"}
    </button>
  )
}
