

// import React, { useState } from "react";
// import { FaCheckCircle, FaSpinner } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { apiClient } from "@api/apiClient";
// import { endpoints } from "@api/endpoints";
// import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
// import { paths } from "@routes/paths";
// import { useNavigate } from "react-router-dom";

// const Step7SubmitApproval = ({ formData }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
    
//     try {
//       // Submit the complete ad data to your API
//       const response = await apiClient.post(endpoints.submitAd, {
//         ...formData,
//         status: "pending_approval"
//       });

//       console.log(response.data)

//       // Handle successful submission
//       setIsSubmitted(true);
//       toast.success("Ad submitted successfully for approval!");
      
//       // Redirect to dashboard or ads page after 3 seconds
//       setTimeout(() => {
//         navigate(paths.adsDashboard);
//       }, 3000);

//     } catch (error) {
//       toast.error(ErrorFormatter(error));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSubmitted) {
//     return (
//       <div className="text-center py-12">
//         <div className="inline-flex items-center justify-center mb-4">
//           <FaCheckCircle className="text-green-500 text-5xl animate-bounce" />
//         </div>
//         <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//           Submission Complete!
//         </h3>
//         <p className="text-gray-600 dark:text-gray-300 mb-6">
//           Your ad has been submitted for approval. You'll receive a notification
//           once it's reviewed. Redirecting to dashboard...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="text-center py-12">
//       <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//         Submit for Approval
//       </h3>
//       <p className="text-gray-600 dark:text-gray-300 mb-6">
//         Once you submit, our team will review your ad and notify you once it is approved.
//         Please ensure all details are correct before submission.
//       </p>
      
//       <div className="flex flex-col items-center gap-4">
//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
//             isSubmitting
//               ? "bg-blue-400 cursor-not-allowed"
//               : "bg-green-500 hover:bg-green-600"
//           } text-white transition-colors`}
//         >
//           {isSubmitting ? (
//             <>
//               <FaSpinner className="animate-spin" />
//               Submitting...
//             </>
//           ) : (
//             "Submit Ad"
//           )}
//         </button>
        
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Note: Approval typically takes 1 - 2 hours
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Step7SubmitApproval;
