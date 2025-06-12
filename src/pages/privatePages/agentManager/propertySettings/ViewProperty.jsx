import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import PropertyCard from "@components/propertyCard/PropertyCard";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";


const ViewProperty = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [propertyData, setPropertyDate] = useState({
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
        setPropertyDate(response.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setIsLoading(false);
      }
    };
    loadProperty();
  }, [slug]);

  if (isLoading) {
    <section className="flex items-center justify-center w-full">
      <PuffLoader />
    </section>;
  }

  return (
    <section className="flex items-center justify-center w-full">
      <PropertyCard
        property={propertyData}
        className="!flex-col w-full"
        leftClass="!w-full "
        rightClass="!w-full"
        buttonsClass="!justify-start gap-4"
      />
    </section>
  );
};

export default ViewProperty;
