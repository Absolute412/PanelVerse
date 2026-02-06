
function ImageModal({ manga, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Stop click bubbling */}
      <div
        className="relative max-w-5xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={manga.image}
          alt={manga.title}
          className="w-full h-full object-contain rounded-lg"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full"
        >
          <Icon icon="mdi:close" />
        </button>
      </div>
    </div>
  );
}

export default ImageModal