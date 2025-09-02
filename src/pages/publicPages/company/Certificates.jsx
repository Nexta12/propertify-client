import { useState } from "react";
import { motion as Motion } from "framer-motion";

const Certificates = ({ activeTab, company}) => {
     const [selectedCert, setSelectedCert] = useState(null);

  return (
    <>
 {activeTab === "certifications" && (
  <Motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
  >
    {company?.certificates?.map((cert, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
        onClick={() => setSelectedCert(cert)} // open modal
      >
        <img
          src={cert?.url}
          alt={cert?.title || `certificate-${idx}`}
          className="w-full h-[400px] sm:h-[500px] object-contain bg-gray-50 dark:bg-gray-800"
        />
        <p className="p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
          {cert?.title}
        </p>
      </div>
    ))}
  </Motion.div>
)}
   {selectedCert && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="relative max-w-4xl w-full p-4">
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={() => setSelectedCert(null)}
      >
        ✕
      </button>
      <img
        src={selectedCert.url}
        alt={selectedCert.title}
        className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
      />
      <p className="mt-3 text-center text-white text-lg font-semibold">
        {selectedCert.title}
      </p>
    </div>
  </div>
)}

    </>
  )
}

export default Certificates