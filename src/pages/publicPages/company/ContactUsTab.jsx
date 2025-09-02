
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";
import { motion as Motion } from "framer-motion";


const ContactUsTab = ({ activeTab, company}) => {
  return (
    <> 
     {activeTab === "contact" && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaPhone className="text-blue-600" />{" "}
                  {company?.phones?.join(", ")}
                </p>
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaWhatsapp className="text-green-600" /> {company?.whatsapp}
                </p>
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaEnvelope className="text-red-600" /> {company?.email}
                </p>
              </div>

              {/* Contact Form */}
              <form className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>
            </Motion.div>
          )}
    
    </>
  )
}

export default ContactUsTab