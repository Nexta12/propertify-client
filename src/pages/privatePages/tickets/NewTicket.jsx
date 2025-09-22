import { useState } from "react";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import { apiClient } from "@api/apiClient";
import { toast } from "react-toastify";
import { supportCategoriesOptions, supportPrioritiesOptions } from "@utils/data";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import DOMPurify from "dompurify";
import HeaderTitle from "@components/ui/HeaderTitle";

import CompleteProfileCall from "@components/profileComplete/CompleteProfileCall";
import EnhancedTextarea from "@components/ui/EnhancedTextArea";

const NewTicket = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !message) {
      toast.error("Subject and message are required.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = {
        subject,
        category,
        priority,
        message: DOMPurify.sanitize(message.trim(), {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        }),
      };

      await apiClient.post(endpoints.createTicket, formData);
      toast.success("Ticket submitted successfully!");

      setCategory("");
      setSubject("");
      setMessage("");
      setPriority("");
    } catch (error) {
      toast.error(ErrorFormatter(error) || "Failed to create support ticket.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8">
      <CompleteProfileCall />
      <HandleGoBackBtn />

      <HeaderTitle titleText="Submit a Support Ticket" />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 border dark:border-gray-400 mt-3 p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnhancedSelect
            name="priority"
            label="Priority"
            value={priority}
            options={supportPrioritiesOptions}
            onChange={(e) => setPriority(e.target.value)}
          />

          <EnhancedSelect
            name="category"
            label="Category"
            value={category}
            options={supportCategoriesOptions}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <EnhancedInput
          id="subject"
          label="Subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Write your message subject here..."
          className="focus:outline-none w-full p-4"
        />

        <EnhancedTextarea
          id="message"
          label="Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue or request in detail..."
          rows={6}
          className="w-full p-4"
        />

        {/* Optional file upload (replace with your FileUpload component if needed) */}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-main-green text-white  px-6 py-2 rounded-lg hover:bg-green-hover disabled:opacity-60 transition-all"
          >
            {isLoading ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;
