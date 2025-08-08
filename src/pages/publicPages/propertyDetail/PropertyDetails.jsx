import { useState, useEffect } from "react";
import { paths } from "@routes/paths";
import { PuffLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { truncate } from "lodash";
import MessageSeller from "./components/MessageSeller";
import Disclaimer from "@pages/privatePages/dashboard/components/Disclaimer";
import OwnerContact from "./components/OwnerContact";
import BreadcrumbNav from "@pages/privatePages/dashboard/components/BreadcrumbNav";
import ImageFullScreen from "./components/ImageFullScreen";
import ImageSlider from "./components/ImageSlider";
import PropertyMainDetail from "./components/PropertyMainDetail";
import PropertyAmenities from "./components/PropertyAmenities";
import LocationMap from "./components/LocationMap";
import PropertyTitleSection from "./components/PropertyTitleSection";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { formatTitleCase } from "@utils/helper";
import Comments from "@components/propertyCard/Comments";

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
        const response = await apiClient.get(
          `${endpoints.fetchProperty}/${slug}`
        );

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
    setCurrentImageIndex((prev) =>
      prev === property?.media?.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? property?.media?.length - 1 : prev - 1
    );


      // FetCh Post Comment.
     useEffect(() => {
       const fetchPostComments = async () => {
         try {
           const response = await apiClient.get(
             `${endpoints.fetchPostComment}/${property?._id}`
           );
   
           setAllComments(response.data.data);
         } catch (error) {
           toast(ErrorFormatter(error));
         }
       };
   
      if(property._id) fetchPostComments();
     }, [property]);

  if (!isLoading) {
    <section className="flex bg-gray-50 items-center justify-center w-full min-h-screen">
      <PuffLoader />
    </section>;
  }

  return (
    <div className="section-container bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav
        baseNave="Home"
        firstPath={paths.properties}
        firstPathTitle="Properties"
        secondPathTitle={truncate(property.title != undefined ? property.title : formatTitleCase(property.slug)  , { length: 20 })}
      />

      <div className=" w-full overflow-x-hidden">
        {/* Main Container */}
        <div className="container mx-auto px-4 py-8 w-full max-w-7xl box-border">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 w-full">
              <HandleGoBackBtn />
              {/* Property Title and Actions */}
              <PropertyTitleSection property={property} />
              {/* {property.isProperty && (
              )} */}

              {/* Image Slider */}
              <ImageSlider
                property={property}
                nextImage={nextImage}
                currentImageIndex={currentImageIndex}
                prevImage={prevImage}
                setShowFullScreen={setShowFullScreen}
                setCurrentImageIndex={setCurrentImageIndex}
              />

              {/* Property Main Details */}
              <PropertyMainDetail property={property} />

              {/* Amenities */}
              {property.isProperty && <PropertyAmenities property={property} />}
              {/* Map Preview */}
              {property.isProperty && <LocationMap property={property} />}

              {/* Comments */}
              <Comments post={property} allComments={allComments} setAllComments={setAllComments} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6 w-full">
              {/* Owner Details & Contact */}

              <OwnerContact property={property} />

              {/* Send Message */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Contact Marketer</h3>
                <MessageSeller
                  receiverId={property.owner._id}
                  propertyId={property._id}
                />
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
  );
};

export default PropertyDetails;
