import { useEffect } from "react";

const ImageFullScreen = ({
  property,
  currentImageIndex,
  nextImage,
  prevImage,
  showFullScreen,
  setShowFullScreen,
}) => {
  const currentMedia = property.media[currentImageIndex];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowFullScreen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    if (showFullScreen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showFullScreen, nextImage, prevImage, setShowFullScreen]);

  if (!showFullScreen || !currentMedia) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center w-full h-full overflow-hidden">
      <button
        onClick={() => setShowFullScreen(false)}
        className="absolute top-4 right-4 text-white text-2xl hover:scale-110 transition"
        title="Close"
      >
        ✕
      </button>

      <div className="relative w-full max-w-5xl px-4">
        {currentMedia.type === "video" ? (
          <video
            src={currentMedia.url}
            controls
            autoPlay
            className="w-full max-h-[80vh] object-contain rounded-md"
          />
        ) : (
          <img
            src={currentMedia.url}
            alt={property?.title}
            className="w-full max-h-[80vh] object-contain rounded-md"
          />
        )}

        {/* Previous Button */}
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white text-black bg-opacity-80 p-2 rounded-full shadow hover:scale-105 transition"
          title="Previous"
        >
          ←
        </button>

        {/* Next Button */}
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black bg-opacity-80 p-2 rounded-full shadow hover:scale-105 transition"
          title="Next"
        >
          →
        </button>

        {/* Index Indicator */}
        <div className="absolute bottom-3 right-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
          {currentImageIndex + 1}/{property.media.length}
        </div>
      </div>
    </div>
  );
};

export default ImageFullScreen;
