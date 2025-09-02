import React, { useState, useEffect } from "react";

const Step4DurationCost = ({ formData, setFormData }) => {
  const [duration, setDuration] = useState(formData.duration || 7);
  const [cost, setCost] = useState(formData.cost || 0);

  const promotionTypeCost = formData.promotionType.dailyCost

  useEffect(() => {
    const calculatedCost = duration * promotionTypeCost; 
    setCost(calculatedCost);
    setFormData({ ...formData, duration, cost: calculatedCost });
  }, [duration]);


  return (
    <div>
      <label className="block mb-2 text-gray-800 dark:text-white font-medium">Select Duration (Days)</label>
      <input
        type="number"
        min="1"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value))}
        className="border rounded-lg px-4 py-2 w-32 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
      <p className="mt-4 text-gray-800 dark:text-white font-semibold">Estimated Cost: ₦{cost.toLocaleString()}</p>
    </div>
  );
};

export default Step4DurationCost;
