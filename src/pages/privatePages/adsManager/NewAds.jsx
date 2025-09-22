import { useEffect, useState } from "react";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import Step1ChoosePost from "./components/Step1ChoosePost";
import Step2AdType from "./components/Step2AdType";
import Step3Location from "./components/Step3Location";
import Step4DurationCost from "./components/Step4DurationCost";
import Step5SummaryPreview from "./components/Step5SummaryPreview";
import Step6Payment from "./components/Step6Payment";
import { useLocation } from "react-router-dom";

const steps = [
  "Choose What to Promote",
  "Choose Advert Type",
  "Choose Location",
  "Set Duration & Cost",
  "Summary & Preview",
  "Payment",
];

const NewAds = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const [formData, setFormData] = useState({
    post: null,
    promotionType: null,
    location: null,
    duration: 7,
    cost: 0,
    paymentInfo: null,
  });

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!formData.post;
      case 1:
        return !!formData.promotionType;
      case 2:
        return !!formData.location;
      case 3:
        return formData.duration > 0 && formData.cost > 0;
      case 5:
        return !!formData.paymentInfo;
      default:
        return true; // steps like summary or final approval have no input requirement
    }
  };

  useEffect(() => {
    if (location.state?.paymentVerified) {
      setCurrentStep(location.state.currentStep);
    }
  }, [location.state]);

  // In NewAds.jsx
  useEffect(() => {
    if (location.state?.paymentVerified) {
      setCurrentStep(location.state.currentStep);
      if (location.state.paymentData) {
        setFormData((prev) => ({
          ...prev,
          paymentInfo: location.state.paymentData,
        }));
      }
    }
  }, [location.state]);

  const nextStep = () => {
    if (canProceed()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      alert("Please complete this step before continuing.");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1ChoosePost formData={formData} setFormData={setFormData} />;
      case 1:
        return <Step2AdType formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step3Location formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step4DurationCost formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step5SummaryPreview formData={formData} />;
      case 5:
        return <Step6Payment formData={formData} setFormData={setFormData} />;
      // case 6: return <Step7SubmitApproval formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="md:h-auto bg-white dark:bg-gray-900 p-1 lg:p-6">
      {/* Progress */}
      <div className="max-w-4xl mx-auto mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </p>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">{steps[currentStep]}</h1>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="max-w-4xl mx-auto mt-8 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
        >
          <FiArrowLeft /> Back
        </button>
        {currentStep < steps.length - 1 && (
          <button
            onClick={nextStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
              canProceed() ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-300 cursor-not-allowed"
            }`}
            disabled={!canProceed()}
          >
            Next <FiArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default NewAds;
