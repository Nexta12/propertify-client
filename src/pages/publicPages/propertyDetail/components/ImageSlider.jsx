import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropertyPlaceholder from "@assets/img/placeholder.webp";

const ImageSlider = ({
  property,
  currentImageIndex,
  setShowFullScreen,
  prevImage,
  nextImage,
  setCurrentImageIndex,
}) => {
  const thumbnailRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const currentMedia = property?.media[currentImageIndex];

  return (
    <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900 w-full">
      <div className="relative group">
        {currentMedia?.type === "video" ? (
          <video
            src={currentMedia.url}
            controls
            className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"
          />
        ) : (
          <img
            src={currentMedia?.url || PropertyPlaceholder}
            alt={property?.title}
            className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover cursor-zoom-in"
            onClick={() => setShowFullScreen(true)}
          />
        )}

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 text-gray-900 dark:text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ←
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 text-gray-900 dark:text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          →
        </button>

        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
          {currentImageIndex + 1}/{property.media.length}
        </div>
      </div>

      {/* Thumbnails */}
      {property.isProperty && (
        <div className="relative flex items-center p-3 bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => scrollThumbnails("left")}
            className="absolute left-0 z-10 bg-white dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 text-gray-900 dark:text-white p-1.5 rounded-full shadow-md hover:bg-opacity-100 transition-opacity"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={thumbnailRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide w-full px-8"
            style={{ scrollBehavior: "smooth" }}
          >
            {property.media.map((media, index) =>
              media.type === "video" ? (
                <video
                  key={index}
                  src={media.url}
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                    currentImageIndex === index ? "border-indigo-500" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ) : (
                <img
                  key={index}
                  src={media.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                    currentImageIndex === index ? "border-indigo-500" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              )
            )}
          </div>
          <button
            onClick={() => scrollThumbnails("right")}
            className="absolute right-0 z-10 bg-white dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 text-gray-900 dark:text-white p-1.5 rounded-full shadow-md hover:bg-opacity-100 transition-opacity"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
