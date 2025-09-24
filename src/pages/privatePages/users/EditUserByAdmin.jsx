import { useRef, useState, useEffect, useCallback } from "react";
import { FiEdit2 } from "react-icons/fi";
import FileUpload from "@components/ui/FileUpload";
import DOMPurify from "dompurify";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import { NigerianStates, professions, roleOptions } from "@utils/data";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import DeleteModal from "@components/deleteModal/DeleteModal";
import { useNavigate, useParams } from "react-router-dom";
import { paths } from "@routes/paths";

const EditUserByAdmin = () => {
  const { slug } = useParams();
  const coverPicRef = useRef();
  const profilePicRef = useRef();
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
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
    role: "",
  });

  // Get The Current User Details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get(`${endpoints.getUserDetails}/${slug}`);
        const { data } = response.data;

        setProfileData({
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
          role: data.role || "",
        });
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (slug) fetchCurrentUser();
  }, [slug]);

  const handleFileUpload = useCallback((name, file) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: file,
    }));
  }, []);

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

    const selectedStateData = NigerianStates.find((s) => s.state === selectedState);
    setCityOptions(
      selectedStateData?.lgas.map((lga) => ({
        label: lga,
        value: lga,
      })) || []
    );
  };

  const handleCoverPicClick = () => {
    if (profileData.coverPic !== null) {
      setOpenModal(true);
      setItemToDelete({ coverPic: profileData.coverPic });
    } else {
      coverPicRef.current?.open();
    }
  };

  const handleProfilePicClick = () => {
    if (profileData.profilePic !== null) {
      setOpenModal(true);
      setItemToDelete({ profilePic: profileData.profilePic });
    } else {
      profilePicRef.current?.open();
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (itemToDelete) {
        const deleteDetails = {
          itemToDelete,
        };

        await apiClient.put(`${endpoints.UpdateUser}/${slug}`, {
          deleteImage: deleteDetails,
        });
      }

      const key = Object.keys(itemToDelete)[0];
      if (key === "coverPic") {
        coverPicRef.current?.open();
      } else if (key === "profilePic") {
        profilePicRef.current?.open();
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setOpenModal(false);
      setItemToDelete(null);
      setIsDeleting(false);
    }
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
      // Create FormData
      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("state", profileData.state);
      formData.append("city", profileData.city);
      formData.append("phone", profileData.phone);
      formData.append("whatsapp", profileData.whatsapp);
      formData.append("profession", profileData.profession);
      formData.append("role", profileData.role);
      formData.append(
        "description",
        DOMPurify.sanitize(profileData.description.trim(), {
          ALLOWED_TAGS: [
            "b",
            "i",
            "em",
            "strong",
            "u",
            "s",
            "p",
            "br",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "blockquote",
            "pre",
            "code",
            "a",
            "img",
            "span",
            "div",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
          ],
          ALLOWED_ATTR: [
            "href",
            "target",
            "rel",
            "src",
            "alt",
            "title",
            "style",
            "class",
            "width",
            "height",
          ],
          KEEP_CONTENT: true,
        })
      );

      // Append files if they're File objects
      if (profileData.profilePic?.url instanceof File) {
        formData.append("profilePic", profileData.profilePic?.url);
      } else if (typeof profileData.profilePic?.url === "string") {
        formData.append("profilePic", profileData.profilePic?.url);
      }

      if (profileData.coverPic?.url instanceof File) {
        formData.append("coverPic", profileData.coverPic?.url);
      } else if (typeof profileData.coverPic?.url === "string") {
        formData.append("coverPic", profileData.coverPic?.url);
      }

      const response = await apiClient.put(`${endpoints.UpdateUser}/${slug}`, formData);

      if (response.status === 200) {
        toast.success("Profile saved successfully!");

        // Update with the new URLs from the response if needed
        if (response.data.profilePic) {
          setProfileData((prev) => ({
            ...prev,
            profilePic: response.data.profilePic,
          }));
        }
        if (response.data.coverPic) {
          setProfileData((prev) => ({
            ...prev,
            coverPic: response.data.coverPic,
          }));
        }
        setTimeout(() => {
          navigate(paths.feed);
        }, 2000);
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
      const selectedStateData = NigerianStates.find((s) => s.state === profileData.state);
      setCityOptions(
        selectedStateData?.lgas.map((lga) => ({
          label: lga,
          value: lga,
        })) || []
      );
    }
  }, [profileData.state]);

  return (
    <section className="">
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        message="This image will be deleted if replaced !"
        isDeleting={isDeleting}
        confirmText="Replace"
        confirmTextClass="!bg-blue-500"
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Cover Photo */}
          <div className="relative mb-16">
            <div className="h-40 bg-gray-300 dark:bg-gray-600 rounded-xl overflow-hidden">
              {profileData.coverPic ? (
                <img
                  src={getImageSrc(profileData.coverPic?.url || profileData.coverPic)}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <FiEdit2 className="text-2xl" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCoverPicClick}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm"
            >
              <FiEdit2 size={14} />
              Change Cover
            </button>

            <FileUpload
              ref={coverPicRef}
              value={profileData.coverPic?.url || profileData.coverPic}
              onChange={(file) => handleFileUpload("coverPic", file)}
              multiple={false}
              maxFiles={1}
              accept="image/*"
              className="hidden"
              key="cover-upload"
            />

            {/* Profile Picture */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-white dark:border-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.profilePic ? (
                    <img
                      src={getImageSrc(profileData.profilePic?.url || profileData.profilePic)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-medium text-gray-500 dark:text-gray-300">
                      {profileData?.firstName?.charAt(0)}
                      {profileData?.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={handleProfilePicClick}
                >
                  <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <FileUpload
              ref={profilePicRef}
              value={profileData.profilePic?.url || profileData.profilePic}
              onChange={(file) => handleFileUpload("profilePic", file)}
              multiple={false}
              maxFiles={1}
              accept="image/*"
              className="hidden"
              key="profile-upload"
            />
          </div>

          {/* Form Inputs */}
          <div className="mt-16 space-y-6">
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
                name="profession"
                label="Profession"
                value={profileData.profession}
                onChange={handleChange}
                options={professions}
                placeholder="Select Profession"
              />

              <EnhancedSelect
                name="role"
                label="Update Role"
                value={profileData.role}
                onChange={handleChange}
                options={roleOptions}
                placeholder="Update Role"
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
                placeholder={profileData.state ? "Select city" : "Select state first"}
                disabled={!profileData.state}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedInput
                name="phone"
                label="Phone Number"
                value={profileData.phone}
                onChange={handleChange}
                required
                maxLength={15}
              />
              <EnhancedInput
                name="whatsapp"
                label="WhatsApp Number"
                value={profileData.whatsapp}
                onChange={handleChange}
                maxLength={15}
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
              withToolbar
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`bg-[#28B16D] hover:bg-[#09C269] text-white font-medium py-3 px-8 rounded shadow-sm transition ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditUserByAdmin;
