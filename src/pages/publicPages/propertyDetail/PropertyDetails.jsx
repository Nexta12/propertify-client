import { useState, useRef, useEffect } from "react";
import { FiShare2, FiMail, FiPhone, FiMapPin, FiHeart } from "react-icons/fi";
import {
  FaWhatsapp,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaChevronLeft,
  FaChevronRight,
  FaDog,
  FaWifi,
  FaParking,
  FaSwimmingPool,
} from "react-icons/fa";
import PropertyPlaceholder from "@assets/img/p1.png";

import PropertyCard from "@components/propertyCard/PropertyCard";
import { paths } from "@routes/paths";
import { CiAlignCenterV } from "react-icons/ci";
import { MdAir, MdLocationOn, MdSecurity } from "react-icons/md";
import Map from "@components/map/Map";
import { PuffLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import FavouriteProperty from "@components/propertyCard/FavouriteProperty";
import SocialShare from "@components/propertyCard/SocialShare";
import { formatLargeNumber } from "@utils/helper";
import Avater from "@assets/img/avater.png";
import { truncate } from "lodash";

const PropertyDetails = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const thumbnailRef = useRef(null);
  // const [isFavorite, setIsFavorite] = useState(false);
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
    mainImage: "",
    otherImages: [],
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

  //Mock related properties
  const relatedProperties = [
    { ...property, id: "2", title: "Modern Condo", price: "$2,200" },
    { ...property, id: "3", title: "City View Apartment", price: "$2,800" },
  ];

  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === property?.otherImages?.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? property?.otherImages?.length - 1 : prev - 1
    );

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!isLoading) {
    <section className="flex bg-gray-50 items-center justify-center w-full min-h-screen">
      <PuffLoader />
    </section>;
  }

  return (
    <div className="section-container bg-gray-50 min-h-screen">
      <ToastContainer />
      {/* Breadcrumb Navigation */}
      <div className=" py-3 px-4 border-b">
        <div className="container mx-auto">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="text-gray-700 hover:text-indigo-600 text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <a
                    href={paths.properties}
                    className="text-gray-700 hover:text-indigo-600 text-sm"
                  >
                    Properties
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-indigo-600 text-sm font-medium capitalize ">
                    { truncate(property?.title, {length: 20})}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className=" w-full overflow-x-hidden">
        {/* Main Container */}
        <div className="container mx-auto px-4 py-8 w-full max-w-7xl box-border">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 w-full">
              {/* Property Title and Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize ">
                    {property?.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MdLocationOn className="mr-1" />
                    <span className="capitalize">
                      {property?.location} {property?.city} {property?.state}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4 md:mt-0 relative">
                  {property.title !== "" && (
                    <FavouriteProperty property={property} className="p-2" />
                  )}
                  {/* <button className="p-2 rounded-full bg-gray-100 text-gray-600">
                    <FiShare2 />
                  </button> */}
                  <div className="relative">
                    <SocialShare />
                  </div>
                </div>
              </div>
              {/* Image Slider */}
              <div className="relative rounded-lg overflow-hidden shadow-lg bg-white w-full">
                <div className="relative group">
                  <img
                    src={property?.otherImages[currentImageIndex] || PropertyPlaceholder}
                    alt={property?.title}
                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover cursor-zoom-in"
                    onClick={() => setShowFullScreen(true)}
                  />
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    →
                  </button>
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                    {currentImageIndex + 1}/{property.otherImages.length}
                  </div>
                </div>
                {/* Thumbnail Preview */}
                <div className="relative flex items-center p-3 bg-gray-100">
                  <button
                    onClick={() => scrollThumbnails("left")}
                    className="absolute left-0 z-10 bg-white bg-opacity-80 p-1.5 rounded-full shadow-md hover:bg-opacity-100 transition-opacity"
                  >
                    <FaChevronLeft />
                  </button>
                  <div
                    ref={thumbnailRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide w-full px-8"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {property.otherImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                          currentImageIndex === index
                            ? "border-indigo-500"
                            : "border-transparent"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => scrollThumbnails("right")}
                    className="absolute right-0 z-10 bg-white bg-opacity-80 p-1.5 rounded-full shadow-md hover:bg-opacity-100 transition-opacity"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full">
                <div className="flex items-center justify-between gap-4 mb-4 ">
                  <p className="text-lg sm:text-xl font-bold text-red-600  capitalize ">
                    {property.documentType}
                  </p>

                  <p className="text-lg sm:text-xl font-bold text-red-600">
                    {property.currency} {formatLargeNumber(property.price)}{" "}
                    <span className="text-xs text-gray-500 capitalize ">
                      {property.frequency}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                  {property.beds != "" && (
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
                        {property.propertySize} {property.propertySizeUnit}{" "}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>

                <p className="text-gray-600 mb-4 text-sm sm:text-base text-justify ">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      {amenity === "Swimming Pool" && (
                        <FaSwimmingPool className="text-indigo-500 mr-2" />
                      )}
                      {amenity === "Parking" && (
                        <FaParking className="text-indigo-500 mr-2" />
                      )}
                      {amenity === "Gym" && (
                        <FaWifi className="text-indigo-500 mr-2" />
                      )}
                      {amenity === "Balcony" && (
                        <FaDog className="text-indigo-500 mr-2" />
                      )}
                      {amenity === "High-Speed Internet" && (
                        <MdAir className="text-indigo-500 mr-2" />
                      )}
                      {amenity === "24/7 Security" && (
                        <MdSecurity className="text-indigo-500 mr-2" />
                      )}
                      {amenity === "Terrace" && (
                        <CiAlignCenterV className="text-indigo-500 mr-2" />
                      )}
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Preview */}
              {/* Location Map */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-6">Location</h3>
                <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
                  {/* Replace with your actual map component */}
                  <Map
                    address={property.address}
                    city={property.city}
                    state={property.state}
                  />

                  {/* <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                    <MdLocationOn className="text-4xl" />
                    <span className="ml-2">Map View of {property.address}</span>
                  </div> */}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <MdLocationOn className="inline mr-1" />
                  {property.location}, {property.state}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 w-full">
              {/* Owner Details & Contact */}

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={property?.owner?.profilePic || Avater }
                    alt={property.owner.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{property.owner.lastName} {property.owner.firstName}</h4>
                    <p className="text-sm text-gray-500 capitalize ">{property.owner.profession}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a
                    href={`tel:${property.owner.phone[0]}`}
                    className="flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <FiPhone className="mr-2" />
                    Call Now
                  </a>
                  <a
                    href={`mailto:${property.owner.email}`}
                    className="flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <FiMail className="mr-2" />
                    Send Email
                  </a>
                  <a
                    href={`https://wa.me/${property.owner.whatsapp}`}
                    className="flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaWhatsapp className="mr-2" />
                    WhatsApp
                  </a>
                </div>
               
              </div>

              {/* Schedule a Visit */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Schedule a Visit</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Request Visit
                  </button>
                </form>
              </div>

              {/* Advanced Search Filter */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Find Similar Properties
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Any Location</option>
                      <option>{property.location}</option>
                      <option>Downtown</option>
                      <option>Suburbs</option>
                      <option>Beachfront</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Any Type</option>
                      <option>{property.type}</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Villa</option>
                      <option>Condo</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Search Properties
                  </button>
                </form>
              </div>

              {/* Social Share */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  Share Property
                </h2>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="#"
                    className="p-2 text-blue-400 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="#"
                    className="p-2 text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                  <button className="p-2 text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <FiShare2 />
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  Disclaimer
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  All information provided is deemed reliable but is not
                  guaranteed and should be independently verified. Prices and
                  availability are subject to change without notice.
                </p>
              </div>
            </div>
          </div>

          {/* Related Properties */}
          <div className="mt-10 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Related Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard
                  key={relatedProperty.id}
                  property={relatedProperty}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Full Screen Image Preview */}
        {showFullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center w-full h-full">
            <button
              onClick={() => setShowFullScreen(false)}
              className="absolute top-4 right-4 text-white text-xl sm:text-2xl"
            >
              ✕
            </button>
            <div className="relative w-full max-w-4xl px-4">
              <img
                src={property.otherImages[currentImageIndex]}
                alt={property.title}
                className="w-full max-h-[80vh] object-contain"
              />
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-1.5 rounded-full shadow-md"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-1.5 rounded-full shadow-md"
              >
                →
              </button>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                {currentImageIndex + 1}/{property.otherImages.length}
              </div>
            </div>
          </div>
        )}

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
