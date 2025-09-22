import PostCard from "@components/propertyCard/PostCard";
import PropertyCard from "@components/propertyCard/PropertyCard";
import WidgetPost from "@components/propertyCard/WidgetPost";

const Step5SummaryPreview = ({ formData }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-1 lg:p-4 rounded-lg">
      <div className="space-y-6">
        {showAds(formData)}
        {AdsDetails(formData)}
      </div>
    </div>
  );
};

export default Step5SummaryPreview;

function showAds(formData) {
  const type = formData.promotionType.id;
  if (type == "feed_Ads") {
    return feedAds(formData);
  } else if (type == "featured") {
    return featuredAds(formData);
  } else if (type == "sponsored_search") {
    return sponsoredSearch(formData);
  } else if (type == "sidebar_widget") {
    return widgetAd(formData);
  } else {
    return null;
  }
}

const AdsDetails = (formData) => (
  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-xs flex items-center flex-wrap gap-4">
    <li>
      <strong>Type:</strong> {formData.promotionType?.name}
    </li>
    <li>
      <strong>Location:</strong> {formData.location?.join(", ")}
    </li>
    <li>
      <strong>Duration:</strong> {formData.duration} days
    </li>
    <li>
      <strong>Cost:</strong> ₦{formData.cost?.toLocaleString()}
    </li>
    {/* <li>
      <strong>Appearance: </strong>Post Feeds
    </li> */}
  </ul>
);

const feedAds = (formData) => (
  <PostCard post={formData.post} isProperty={formData.post.isProperty} promoType={"Promoted"} />
);

const featuredAds = (formData) => (
  <PropertyCard
    property={formData.post}
    imgClass="lg:h-[200px]"
    promoType={formData.promotionType?.name}
  />
);

const sponsoredSearch = (formData) => {
  const { post } = formData;
  return <PostCard post={post} isProperty={post.isProperty} promoType={"Sponsored"} />;
};

const widgetAd = (formData) => {
  const { post } = formData;
  return <WidgetPost property={post} promoType={"Ad"} />;
};
