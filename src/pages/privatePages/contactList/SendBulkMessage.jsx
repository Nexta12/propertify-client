import { useEffect, useState, useRef, useCallback } from "react";
import { FiSend, FiUsers, FiUser, FiSearch } from "react-icons/fi";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import useAuthStore from "@store/authStore";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { endpoints } from "@api/endpoints";
import { apiClient } from "@api/apiClient";
import { toast } from "react-toastify";
import FileUpload from "@components/ui/FileUpload";
import EnhancedInput from "@components/ui/EnhancedInput";
import CompleteProfileCall from "@components/profileComplete/CompleteProfileCall";
import { UserRole } from "@utils/constant";
import { formatTitleCase } from "@utils/helper";
import DOMPurify from "dompurify";
import HeaderTitle from "@components/ui/HeaderTitle";

const BulkMessage = () => {
  const { user } = useAuthStore();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("individual");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [mediaData, setMediaData] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const scrollContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Handle scroll events for infinite loading
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Fetch contacts with pagination
  useEffect(() => {
    const fetchContactList = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsFetching(true);
      try {
        const url =
          user.role !== UserRole.ADMIN
            ? `${endpoints.fetchUserContactsList}/${user?.id}`
            : endpoints.getAllUsers;

        const res = await apiClient.get(url, {
          params: {
            page,
            limit: 20,
            search: searchTerm,
          },
          signal: abortControllerRef.current.signal,
        });

        const { data, pagination } = res.data.data;
        setAllContacts((prev) => (page === 1 ? data : [...prev, ...data]));
        setHasMore(pagination.currentPage * pagination.limit < pagination.total);
      } catch (error) {
        const isAbortError =
          error.name === "AbortError" ||
          error.code === "ERR_CANCELED" ||
          error.message.includes("aborted") ||
          error.message.includes("cancel");

        if (!isAbortError) {
          toast.error(ErrorFormatter(error));
        }
      } finally {
        setIsFetching(false);
      }
    };

    if (user?.id && user.role) {
      fetchContactList();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [page, user?.id, user.role, searchTerm]);

  // Reset pagination when search term changes
  useEffect(() => {
    setAllContacts([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Filter contacts based on search term
  const filteredContacts = allContacts.filter((contact) => {
    const firstName = contact.firstName?.toLowerCase() || "";
    const lastName = contact.lastName?.toLowerCase() || "";
    const email = contact.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return firstName.includes(search) || lastName.includes(search) || email.includes(search);
  });

  const toggleContactSelection = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const messageDetails = {
      contacts:
        recipientType === "individual"
          ? selectedContacts
          : recipientType === "all"
            ? allContacts.map((contact) => contact._id)
            : null,
      message: DOMPurify.sanitize(message.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      }),
      subject,
      mediaData,
    };

    try {
      await apiClient.post(endpoints.sendBulkMessage, messageDetails);
      toast.success("Message Sent");

      setMessage("");
      setSubject("");
      setMediaData("");
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HandleGoBackBtn />
      <div className="w-full mx-auto min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto mb-8 pt-4">
          <CompleteProfileCall />
          <HeaderTitle titleText="Send Messages" className="text-center" />

          <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden p-6 md:p-8 rounded-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Send To
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setRecipientType("individual")}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                      recipientType === "individual"
                        ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-100"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FiUser className="mr-2" />
                    Individual(s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType("all")}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                      recipientType === "all"
                        ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-100"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FiUsers className="mr-2" />
                    All Contacts
                  </button>
                </div>
              </div>

              {/* Contacts Table */}
              {recipientType === "individual" && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-300 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <div ref={scrollContainerRef} className="max-h-60 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              <input
                                type="checkbox"
                                checked={
                                  selectedContacts.length === filteredContacts.length &&
                                  filteredContacts.length > 0
                                }
                                onChange={selectAllContacts}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Profession
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Email
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredContacts.map((contact, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedContacts.includes(contact._id)}
                                  onChange={() => toggleContactSelection(contact._id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {contact.title} {contact.firstName || "NA"} {contact.lastName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatTitleCase(contact.profession)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {contact.email}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {isFetching && (
                        <div className="flex justify-center p-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      {filteredContacts.length === 0 && !isFetching && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          {allContacts.length === 0 ? "No contacts found" : "No matching contacts"}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedContacts.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-100 border border-blue-200 dark:border-blue-300 rounded-lg p-3 text-sm text-blue-800">
                      <FiUser className="inline mr-2" />
                      {selectedContacts.length} contact
                      {selectedContacts.length !== 1 ? "s" : ""} selected
                    </div>
                  )}
                </div>
              )}

              {/* All Contacts Info */}
              {recipientType === "all" && (
                <div className="bg-blue-50 dark:bg-blue-100 border border-blue-200 dark:border-blue-300 rounded-lg p-4 text-blue-800">
                  <FiUsers className="inline mr-2" />
                  Message will be sent to all {allContacts.length} contacts in your address book.
                </div>
              )}

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Subject
                </label>
                <EnhancedInput
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Write your message subject here..."
                  rows={6}
                  className="focus:outline-none w-full p-4 bg-white dark:bg-gray-700 dark:text-gray-100 border dark:border-gray-600"
                />
              </div>

              {/* Message Field + Upload */}
              {user?.firstName && user?.lastName && (
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Message
                  </label>
                  <EnhancedTextarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={6}
                    required
                    className="focus:outline-none w-full p-4 bg-white dark:bg-gray-700 dark:text-gray-100 border dark:border-gray-600"
                  />

                  <FileUpload
                    value={mediaData}
                    onChange={(file) => {
                      if (file && file.url) {
                        setMediaData(file.url);
                      } else {
                        setMediaData(null);
                      }
                    }}
                    multiple={false}
                    maxFiles={1}
                    accept="image/*"
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-green-500 transition-colors"
                  />
                </div>
              )}

              {/* Submit Button */}
              {user?.firstName && user?.lastName && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={recipientType === "individual" && selectedContacts.length === 0}
                    className={`flex items-center px-6 py-3 rounded-lg shadow-sm transition-colors ${
                      recipientType === "individual" && selectedContacts.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FiSend className="mr-2" />
                    {loading ? "Please Wait..." : "Send Message"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkMessage;
