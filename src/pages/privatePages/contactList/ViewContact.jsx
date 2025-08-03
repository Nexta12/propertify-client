import {
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import { useEffect, useState } from "react";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import Avater from "@assets/img/avater.png";
import { formatTitleCase } from "@utils/helper";
import EnhancedInput from "@components/ui/EnhancedInput";

const ViewContact = () => {
  // const [message, setMessage] = useState("");
  // const [subject, setSubject] = useState("");
  // const [sending, setSending] = useState(false);
  const { id } = useParams();
  const [contactDetails, setContactDetails] = useState(null);

  // fetch Contact.

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await apiClient.get(
          `${endpoints.getContactDetails}/${id}`
        );
        setContactDetails(response.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    fetchContactDetails();
  }, [id]);

  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   setSending(true);
  //   const messageDetails = {
  //     contacts: [contactDetails._id],
  //     message,
  //     subject,
  //   };

  //   try {
  //     await apiClient.post(endpoints.sendBulkMessage, messageDetails);

  //     toast.success("Message Sent");
  //   } catch (error) {
  //     toast.error(ErrorFormatter(error));
  //   } finally {
  //     setSending(false);
  //   }
  // };


  return (
    <div className="min-h-screen bg-gray-50  ">
      <div className=" mx-auto mb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <HandleGoBackBtn />
          <span></span>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Profile */}
            <div className="md:w-1/3 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex flex-col items-center">
                <img
                  src={contactDetails?.profilePicture || Avater}
                  alt={contactDetails?.fullName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg mb-6"
                />
                <h2 className="text-2xl font-bold text-gray-800">
                  {contactDetails?.fullName}
                </h2>
                <p className="text-gray-600 mb-6">
                  {formatTitleCase(contactDetails?.profession)}
                </p>

                {/* Quick Actions */}
                <div className="flex space-x-3 mb-8">
                  <a
                    href={`tel:${contactDetails?.phone}`}
                    className="p-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                    title="Call"
                  >
                    <FiPhone size={20} />
                  </a>
                  <a
                    href={`https://wa.me/${contactDetails?.phone?.replace(
                      /[^\d]/g,
                      ""
                    )}`}
                    className="p-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                    title="WhatsApp"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                  <a
                    href={`mailto:${contactDetails?.email}`}
                    className="p-3 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    title="Email"
                  >
                    <FiMail size={20} />
                  </a>
                </div>

                {/* Contact Details */}
                <div className="w-full space-y-4">
                  <div className="flex items-start">
                    <FiMail className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href={`mailto:${contactDetails?.email}`}
                        className="text-gray-800 hover:text-blue-600 hover:underline"
                      >
                        {contactDetails?.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiPhone className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href={`tel:${contactDetails?.phone}`}
                        className="text-gray-800 hover:text-blue-600 hover:underline"
                      >
                        {contactDetails?.phone}
                      </a>
                    </div>
                  </div>


                  <div className="flex items-start">
                    <FiMessageSquare className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Preferred Contact Method
                      </p>
                      <p className="text-gray-800 capitalize">
                        {contactDetails?.preferredContactMethod.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Notes and Message Form */}
            <div className="md:w-2/3 p-6 md:p-8">
              {/* Notes Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Notes
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">
                    {contactDetails?.notes ||
                      "No notes available for this contact."}
                  </p>
                </div>
              </div>

              {/* Message Form */}
              {/* <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Send Message
                </h3>
                <form onSubmit={handleSendMessage}>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <EnhancedInput
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Write your message subject here..."
                      rows={6}
                      className="focus:outline-none w-full mb-6 "
                      required
                    />
                  </div>
                  <EnhancedTextarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    className="mb-4 w-full focus:outline-none p-4"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FiMail className="mr-2" />
                      {sending ? "Please Wait..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContact;
