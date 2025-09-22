const PROMOTION_LABELS = {
  feed_Ads: "Promoted",
  featured: "Featured",
  sponsored_search: "Sponsored",
  event_promotion: "Ad",
  sidebar_widget: "Ad",
};

const PromotionBadge = ({ post, className = "" }) => {
  if (!post || post.promotionStatus !== "active") return null;

  const label = PROMOTION_LABELS[post.promotionType];
  if (!label) return null;

  return (
    <span
      className={`text-[11px] font-medium text-orange dark:text-orange-100 italic flex items-center gap-1 ${className}`}
    >
      {label}
    </span>
  );
};

export default PromotionBadge;
