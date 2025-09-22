import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import Button from "@components/ui/Button";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import HeaderTitle from "@components/ui/HeaderTitle";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useState } from "react";
import { toast } from "react-toastify";

const UpdatePromoStatus = ({ promo, onFinish }) => {
  const [promotionStatus, setPromotionStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const options = [
    {
      label: "Activate",
      value: "active",
    },
    {
      label: "Reject",
      value: "rejected",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post(`${endpoints.updateAdsStatus}/${promo}`, { promotionStatus });

      toast.success("Ads status updated");

      onFinish();
    } catch (error) {
      toast.error(ErrorFormatter(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="w-full text-center">
        <HeaderTitle titleText="Update Ads Status" />
      </div>
      <form action="" className="space-y-6" onSubmit={handleSubmit}>
        <EnhancedSelect
          options={options}
          name="promotionStatus"
          value={promotionStatus}
          onChange={(e) => setPromotionStatus(e.target.value)}
        />
        <div className="flex items-center justify-center">
          <Button type="submit" variant="success" className="px-6">
            {loading ? "Please Wait..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePromoStatus;
