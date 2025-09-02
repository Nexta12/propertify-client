
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Step6Payment = ({ formData, setFormData}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate()

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setFormData({ ...formData, paymentInfo: { method } });
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      const promotionData = {
        postId: formData.post.id,
        userId: formData?.post?.owner?._id,
        promotionType: formData.promotionType.id,
        location: formData.location,
        duration: formData.duration,
        cost: formData.cost * 100, // converting to kobo
        media: formData.post.media,
        paymentMethod: paymentMethod,
        email: formData?.post?.owner?.email
      };

      if (paymentMethod === "Card Payment") {
        // Initialize payment
        const paymentResponse = await apiClient.post(endpoints.initializePayment, promotionData);
        const { redirectUrl } = paymentResponse.data.data;
        // Redirect to payment URL
        window.location.href = redirectUrl;
      } else if (paymentMethod === "Bank Transfer") {
        // For bank transfer, create the ad directly
        await apiClient.post(endpoints.createAds, promotionData);
        toast.success("Ad promotion Created, Please send evidence of payment for activation.");
        setTimeout(()=>{
           navigate(`${paths.protected}/ads/all`)

        },3000)
      }

    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Choose Payment Method
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {["Card Payment", "Bank Transfer"].map((method) => (
          <div
            key={method}
            onClick={() => handlePaymentSelect(method)}
            className={`border rounded-lg p-4 cursor-pointer dark:text-gray-400 ${
              paymentMethod === method
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {method}
          </div>
        ))}
      </div>

      {paymentMethod === "Bank Transfer" && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Bank Transfer Details</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p><span className="font-medium">Bank Name:</span> {import.meta.env.VITE_BANK_NAME} </p>
            <p><span className="font-medium">Account Name:</span> {import.meta.env.VITE_ACCOUNT_NAME}</p>
            <p><span className="font-medium">Account Number:</span> {import.meta.env.VITE_ACCOUNT_NUMBER}</p>
            <p><span className="font-medium">Amount:</span> ₦{formData.cost.toLocaleString()}</p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-800 dark:text-white mb-1">Payment Instructions:</h5>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Make a transfer to the account details above</li>
                <li className="font-bold" >Use your post ID as the payment reference: {formData.post.id}</li>
                <li className="font-bold" >Raise a support ticket and send proof of payment</li>
                <li>You can also Send payment confirmation to {import.meta.env.VITE_OFFICIAL_EMAIL}</li>
                <li>Your ad will be activated within 24 hours of payment confirmation</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!paymentMethod || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : paymentMethod === "Bank Transfer" ? "Confirm Bank Transfer" : "Complete Payment"}
      </button>
    </div>
  );
};

export default Step6Payment;
