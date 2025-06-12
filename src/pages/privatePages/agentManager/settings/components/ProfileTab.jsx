import React, { useRef, useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import FileUpload from "@components/ui/FileUpload";
import DOMPurify from "dompurify";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import { NigerianStates, professions, TitleOptions } from "@utils/data";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { debounce } from "lodash";
import { apiClient } from "@api/apiClient";
import useAuthStore from "@store/authStore";
import { endpoints } from "@api/endpoints";

const ProfileTab = () => {
  const { user } = useAuthStore();
  const coverPicRef = useRef();
  const profilePicRef = useRef();
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize state with data from localStorage or empty object
  const [profileData, setProfileData] = useState(() => {
    try {
      const savedData = localStorage.getItem("profileData");
      return savedData
        ? JSON.parse(savedData)
        : {
            title: "",
            firstName: "",
            lastName: "",
            state: "",
            city: "",
            profilePic: null,
            coverPic: null,
            description: "",
            phone: "",
            whatsapp: "",
            profession: "",
          };
    } catch (error) {
      console.error("Failed to parse stored profile data", error);
      return {
        title: "",
        firstName: "",
        lastName: "",
        state: "",
        city: "",
        profilePic: null,
        coverPic: null,
        description: "",
        phone: "",
        whatsapp: "",
        profession: "",
      };
    }
  });

  // Get The Current User Details

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get(
          `${endpoints.getUserDetails}/${user.slug}`
        );

        const { data } = response.data;

        // Only take the fields we want to manage
        setProfileData({
          title: data.title || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          state: data.state || "",
          city: data.city || "",
          profilePic: data.profilePic || null,
          coverPic: data.coverPic || null,
          description: data.description || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          profession: data.profession || "",
        });
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (user.slug) fetchCurrentUser();
  }, [user.slug]);

  // Debounced save to localStorage
  const saveToStorage = debounce((data) => {
    try {
      // Don't store File objects as they can't be serialized
      const dataToStore = {
        ...data,
        profilePic:
          typeof data.profilePic === "string" ? data.profilePic : null,
        coverPic: typeof data.coverPic === "string" ? data.coverPic : null,
      };
      localStorage.setItem("profileData", JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to save profile data", error);
    }
  }, 500);

  // Save to localStorage whenever profileData changes
  useEffect(() => {
    saveToStorage(profileData);
    return () => saveToStorage.cancel();
  }, [profileData]);

  const handleFileUpload = (name, file) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: file,
    }));

  };

  // Options data
  const stateOptions = NigerianStates.map((state) => ({
    label: state.state,
    value: state.state,
  }));

  // Handlers
  const handleStateChange = (e) => {
    const selectedState = e.target.value;

    setProfileData((prev) => ({
      ...prev,
      state: selectedState,
      city: "",
    }));

    const selectedStateData = NigerianStates.find(
      (s) => s.state === selectedState
    );
    const newCityOptions =
      selectedStateData?.lgas.map((lga) => ({
        label: lga,
        value: lga,
      })) || [];

    setCityOptions(newCityOptions);
  };

  const handleCoverPicClick = () => {
    coverPicRef.current?.open();
  };

  const handleProfilePicClick = () => {
    profilePicRef.current?.open();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sanitizedFormData = {
        title: profileData.title,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        state: profileData.state,
        city: profileData.city,
        phone: profileData.phone,
        whatsapp: profileData.whatsapp,
        profession: profileData.profession,
        description: DOMPurify.sanitize(profileData.description.trim(), {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
        // Only include profilePic/coverPic if they're strings (URLs)
        ...(typeof profileData.profilePic === "string" && {
          profilePic: profileData.profilePic,
        }),
        ...(typeof profileData.coverPic === "string" && {
          coverPic: profileData.coverPic,
        }),
      };

      const response = await apiClient.put(
        `${endpoints.UpdateUser}/${user?.slug}`,
        sanitizedFormData
      );

      if (response.status === 200) {
        // Clear storage after successful submission if desired
        localStorage.removeItem("profileData");
        toast.success("Profile saved successfully!");
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image source
  const getImageSrc = (image) => {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (image instanceof File) return URL.createObjectURL(image);
    return null;
  };

  // Initialize city options when component mounts or state changes
  useEffect(() => {
    if (profileData.state) {
      const selectedStateData = NigerianStates.find(
        (s) => s.state === profileData.state
      );
      const newCityOptions =
        selectedStateData?.lgas.map((lga) => ({
          label: lga,
          value: lga,
        })) || [];
      setCityOptions(newCityOptions);
    }
  }, [profileData.state]);

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Cover Photo */}
          <div className="relative mb-16">
            <div className="h-40 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl overflow-hidden">
              {profileData.coverPic ? (
                <img
                  src={getImageSrc(profileData.coverPic)}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiEdit2 onClick={handleCoverPicClick} className="text-2xl" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCoverPicClick}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm"
            >
              <FiEdit2 size={14} />
              Change Cover
            </button>
            <FileUpload
              ref={coverPicRef}
              value={profileData.coverPic}
              onChange={(file) => handleFileUpload("coverPic", file)}
              multiple={false}
              maxFiles={1}
              accept="image/*"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors hidden"
            />

            {/* Profile Picture */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  {profileData.profilePic ? (
                    <img
                      src={getImageSrc(profileData.profilePic)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-medium text-gray-500">
                      {profileData?.firstName?.charAt(0)}
                      {profileData?.lastName?.charAt(0)}
                    </span>
                  )}
                  <FileUpload
                    ref={profilePicRef}
                    value={profileData.profilePic}
                    onChange={(file) => handleFileUpload("profilePic", file)}
                    multiple={false}
                    maxFiles={1}
                    accept="image/*"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors hidden"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50"
                  onClick={handleProfilePicClick}
                >
                  <FiEdit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          {/* Form Inputs */}

          <div className="mt-16 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedSelect
                name="title"
                label="Title"
                value={profileData.title}
                onChange={handleChange}
                options={TitleOptions}
                placeholder="Select Title"
              />
              <EnhancedSelect
                name="profession"
                label="Profession"
                value={profileData.profession}
                onChange={handleChange}
                options={professions}
                placeholder="Select Profession"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedInput
                name="firstName"
                label="First Name"
                value={profileData.firstName}
                onChange={handleChange}
                placeholder="e.g. John"
                maxLength={35}
                required
              />
              <EnhancedInput
                name="lastName"
                label="Last Name"
                value={profileData.lastName}
                onChange={handleChange}
                placeholder="e.g. Doe"
                maxLength={35}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedSelect
                name="state"
                label="Location"
                value={profileData.state}
                onChange={handleStateChange}
                options={stateOptions}
                placeholder="Select State"
              />
              <EnhancedSelect
                name="city"
                label="City"
                value={profileData.city}
                onChange={handleChange}
                options={cityOptions}
                placeholder={
                  profileData.state ? "Select city" : "Select state first"
                }
                disabled={!profileData.state}
                required
                key={profileData.state}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedInput
                name="phone"
                label="Phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

              <EnhancedInput
                name="whatsapp"
                label="Whatsapp Line"
                value={profileData.whatsapp}
                onChange={handleChange}
                placeholder="Enter Your whatsapp number"
                maxLength={13}
              />
            </div>
          </div>

          <div>
            <EnhancedTextarea
              name="description"
              label="Bio"
              value={profileData.description}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`bg-[#28B16D] hover:bg-[#09C269] text-white font-medium py-3 px-8 rounded shadow-sm transition ${
                loading ? "disabled" : ""
              }`}
            >
              {loading ? "Updating..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProfileTab;
