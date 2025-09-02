import React from "react";
import { Link } from "react-router-dom";
import { paths } from "@routes/paths";
import { formatLargeNumber } from "@utils/helper";
import PropertyPlaceholder from "@assets/img/p1.png";
import PromotionBadge from "./PromotionBadge";

const WidgetPost = ({ property, promoType }) => {
  if (!property) return null;

  const isVideo = property?.media?.[0]?.type === "video";
  const mediaUrl = property?.media?.[0]?.url || PropertyPlaceholder;

  return (
    <div className="flex gap-3 p-3 mb-4 rounded-md bg-white dark:bg-gray-800 shadow hover:shadow-md transition cursor-pointer">
       
      {/* Thumbnail */}
      {property.media.length > 0 && (
      <Link
        to={`${paths.properties}/${property.slug}`}
        className="flex-shrink-0 w-[90px] h-[80px] rounded-md overflow-hidden"
      >
        {isVideo ? (
          <video
            className="w-full h-full object-cover"
            src={mediaUrl}
            muted
            autoPlay
            loop
          />
        ) : (
          <img
            src={mediaUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        )}
      </Link>
       )}
      {/* Content */}
      <div className="flex flex-col flex-1 justify-between relative">
        {/* Promotion Section */}
         {property.promotionType == "sidebar_widget" && <PromotionBadge post={property} className="text-xs absolute -top-2 right-0 mb-2" /> }
         {/* This is used as an ads sample placeholder when publishing an ad */}
       {promoType && (<span className="text-xs text-orange absolute -top-2 right-0 mb-2"title="Promoted" >{ promoType}</span> )}
      
        {/* Title */}
        {property.title && (
          <Link
            to={`${paths.properties}/${property.slug}`}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-orange-500"
          >
            {property.title}
          </Link>
        )}

        {/* Price */}
        {property.price && (
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
            {property.currency || "₦"} {formatLargeNumber(property.price)}
            {property.frequency && (
              <span className="text-[11px] text-gray-500 dark:text-gray-400 ml-1 capitalize">
                /{property.frequency}
              </span>
            )}
          </p>
        )}

        {/* Location */}
        {property.location && (
          <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1">
            {property.location} {property.city} {property.state}
          </p>
        )}

        {/* Description */}
           <Link to={`${paths.properties}/${property.slug}`}>
        {property.description && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
            {property.description}
          </p>
        )}
        </Link>
      </div>
    </div>
  );
};

export default WidgetPost;
