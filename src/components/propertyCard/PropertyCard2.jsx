import { memo, useState } from "react";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { Link } from "react-router-dom";
import { paths } from "@routes/paths";
import { formatLargeNumber } from "@utils/helper";
import { truncate } from "lodash";
import SocialShare from "./SocialShare";
import PropertyOwnerContact from "./propertyOwnerContact";
import FavouriteProperty from "./FavouriteProperty";

const PropertyCard = memo(
  ({ property, className, leftClass, rightClass, buttonsClass }) => {

  
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const nextImage = () =>
      setCurrentImageIndex((prev) =>
        prev === property.otherImages.length - 1 ? 0 : prev + 1
      );

    const prevImage = () =>
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.otherImages.length - 1 : prev - 1
      );

    return (
      <div
        className={`flex flex-col sm:flex-row rounded-sm overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 max-w-4xl ${className}`}
      >
        {/* Image Gallery - Left Side */}
        <div
          className={`relative w-full sm:w-1/2 h-64 sm:h-auto group rounded-sm  ${leftClass}`}
        >
          <Link to={`${paths.properties}/${property.slug}`}>
            <img
              src={property?.otherImages[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
            {currentImageIndex + 1}/{property.otherImages.length}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            &larr;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            &rarr;
          </button>

          {/* Favorite Button */}
          <FavouriteProperty property={property} className="absolute top-4 right-4 p-2" />
        </div>

        {/* Property Details - Right Side */}
        <div className={`w-full sm:w-1/2 p-5 flex flex-col ${rightClass}`}>
          {/* Category and Price */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                {property.purpose}
              </span>
            </div>

            <div className="text-right">
              <p className=" font-bold orangeText">
                {property.currency || "₦"} {formatLargeNumber(property.price)}{" "}
                <span className="text-xs text-gray-500 capitalize ">
                  {property.frequency}
                </span>
              </p>
            </div>
          </div>

          {/* Property Title */}
          <div className="w-full">
            <Link to={`${paths.properties}/${property.slug}`}>
              {" "}
              <h3 className="font-bold text-gray-900 mt-2 capitalize ">
                {property.title}
              </h3>
            </Link>
            <p className="text-xs">
              {truncate(property.description, { length: 100 })}
            </p>
          </div>

          {/* Key Features */}
          <div className="flex gap-4 my-4 text-sm text-gray-600">
            {property.beds && (
              <div className="flex items-center">
                <FaBed className="mr-1 text-indigo-500" />
                <span>{property.beds} Beds</span>
              </div>
            )}
            {property.baths && (
              <div className="flex items-center">
                <FaBath className="mr-1 text-indigo-500" />
                <span>{property.baths} Baths</span>
              </div>
            )}
            {property.propertySize && (
              <div className="flex items-center">
                <FaRulerCombined className="mr-1 text-indigo-500" />
                <span>
                  {property.propertySize} {property.propertySizeUnit}
                </span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="line-clamp-1 capitalize ">
              {property.location} {property.city} {property.state}
            </span>
          </div>

          {/* Owner & Contact */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div
              className={`flex justify-between items-center relative ${buttonsClass}`}
            >
              {/* Contact owner via whatsapp, email, call */}
              <PropertyOwnerContact property={property} />
              {/* Social Share */}
              <SocialShare />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PropertyCard;
