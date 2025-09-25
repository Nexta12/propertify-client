import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import MessageSeller from "./components/MessageSeller";
import Disclaimer from "@pages/privatePages/dashboard/components/Disclaimer";
import OwnerContact from "./components/OwnerContact";
import ImageFullScreen from "./components/ImageFullScreen";
import ImageSlider from "./components/ImageSlider";
import PropertyMainDetail from "./components/PropertyMainDetail";
import PropertyAmenities from "./components/PropertyAmenities";
import LocationMap from "./components/LocationMap";
import PropertyTitleSection from "./components/PropertyTitleSection";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import Comments from "@components/propertyCard/Comments";
import RightWidgetAdsHandler from "@pages/privatePages/feed/RightWidgetAdsHandler";

const PropertyDetails = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState({
    _id: "",
    title: "",
    slug: "",
    documentType: "",
    price: 0,
    frequency: "",
    state: "",
    city: "",
    location: "",
    description: "",
    amenities: [],
    propertyType: "",
    beds: "",
    baths: "",
    purpose: "",
    videoUrl: "",
    propertySize: "",
    propertySizeUnit: "",
    media: [],
    owner: {
      location: "",
      slug: "",
      likedProperties: [],
      email: "",
      phone: [],
      profession: "",
    },
    status: [],
    views: 0,
    clicks: 0,
  });

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await apiClient.get(`${endpoints.fetchProperty}/${slug}`);

        setProperty(response.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setIsLoading(false);
      }
    };
    loadProperty();
  }, [slug]);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === property?.media?.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? property?.media?.length - 1 : prev - 1));

  // FetCh Post Comment.
  useEffect(() => {
    const fetchPostComments = async () => {
      try {
        const response = await apiClient.get(`${endpoints.fetchPostComment}/${property?._id}`);

        setAllComments(response.data.data);
      } catch (error) {
        toast(ErrorFormatter(error));
      }
    };

    if (property._id) fetchPostComments();
  }, [property]);

  if (!isLoading) {
    <section className="flex bg-gray-50 items-center justify-center w-full min-h-screen">
      <PuffLoader />
    </section>;
  }

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 section-container min-h-screen">
      <div className="">
        <div className=" w-full overflow-x-hidden">
          {/* Main Container */}
          <div className="container mx-auto w-full max-w-7xl box-border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start justify-items-start ">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6 w-full  p-4 rounded-md bg-white dark:bg-gray-800">
                <HandleGoBackBtn />
                {/* Property Title and Actions */}
                <PropertyTitleSection property={property} />
                {/* {property.isProperty && (
              )} */}

                {/* Image Slider */}
                {property.media.length > 0 && (
                  <ImageSlider
                    property={property}
                    nextImage={nextImage}
                    currentImageIndex={currentImageIndex}
                    prevImage={prevImage}
                    setShowFullScreen={setShowFullScreen}
                    setCurrentImageIndex={setCurrentImageIndex}
                  />
                )}

                {/* Property Main Details */}
                <PropertyMainDetail property={property} />

                {/* Amenities */}
                {property.isProperty && <PropertyAmenities property={property} />}
                {/* Map Preview */}
                {property.isProperty && <LocationMap property={property} />}

                {/* Comments */}
                <Comments
                  post={property}
                  allComments={allComments}
                  setAllComments={setAllComments}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6 w-full">
                {/* Owner Details & Contact */}

                <OwnerContact property={property} />

                <RightWidgetAdsHandler />

                {/* Send Message */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-semibold mb-4 dark:text-gray-200">
                    Contact This Marketer
                  </h3>
                  <MessageSeller receiverId={property.owner._id} propertyId={property._id} />
                </div>

                {/* Schedule a Visit */}
                {/* <ScheduleAVisist /> */}

                {/* Advanced Search Filter */}
                {/* <SimilarPropertySearch property={property} /> */}

                {/* Disclaimer */}
                {property.isProperty && <Disclaimer />}
              </div>
            </div>

            {/* Related Properties */}
          </div>

          {/* Full Screen Image Preview */}
          <ImageFullScreen
            property={property}
            currentImageIndex={currentImageIndex}
            nextImage={nextImage}
            prevImage={prevImage}
            showFullScreen={showFullScreen}
            setShowFullScreen={setShowFullScreen}
          />

          {/* Inline CSS to hide scrollbar */}
          <style>
            {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
