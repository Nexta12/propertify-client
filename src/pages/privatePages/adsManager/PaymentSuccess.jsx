import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { paths } from "@routes/paths";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const trxref = searchParams.get("trxref");
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    // If both trxref and reference are missing, redirect to home
    if (!trxref && !reference) {
      navigate(paths.index);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await apiClient.post(
          `${endpoints.ConfirmPayment}/?trxref=${trxref}&reference=${reference}`
        );
        setPaymentStatus(res.data.data.data);

        if (res.data.data.data === "success") {
          setTimeout(() => {
            navigate(`${paths.protected}/ads/all`);
          }, 3000);
        }
      } catch (error) {
        toast.error(ErrorFormatter(error));
        setPaymentStatus("failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [trxref, reference, navigate]);

  // Prevent rendering if trxref or reference is missing
  if (!trxref && !reference) return <PuffLoader />;

  // Show loading state while verifying
  if (loading) return <PuffLoader />;

  // Render failed transaction page if payment is not successful
  if (paymentStatus !== "success") {
    return (
      <section className="">
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black to-red-500 ">
          {/* Overlay */}
          <div className="absolute w-full h-full bg-black/50"></div>

          {/* Failed Transaction Card */}
          <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl p-8 rounded-2xl text-center max-w-md w-full">
            <FaTimesCircle className="text-red-500 text-6xl mx-auto animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Transaction Failed</h2>
            <p className="text-gray-600 mt-2">Your payment was not successful. Please try again.</p>

            {/* Additional Info */}
            <div className="mt-6 border-t border-gray-300 pt-4">
              <p className="text-gray-700 text-sm mb-6">
                If you were charged, please contact support.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render success page if payment is successful
  return (
    <section className="">
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black to-accent ">
        {/* Overlay */}
        <div className="absolute w-full h-full bg-black/50"></div>

        {/* Success Card */}
        <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl p-8 rounded-2xl text-center max-w-md w-full">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto animate-bounce" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Reservation Successful</h2>
          <p className="text-gray-600 mt-2">
            Your booking has been confirmed. Thank you for choosing us!
          </p>

          {/* Additional Info */}
          <div className="mt-6 border-t border-gray-300 pt-4">
            <p className="text-gray-700 text-sm mb-6">
              You will receive a confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
