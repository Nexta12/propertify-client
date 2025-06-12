import { useState, useEffect } from "react";


const EnhancedCheckbox = ({
  name,
  label,
  value = [],
  onChange,
  required = false,
  amenities = [],
  className = "",
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState(value);
  const [error, setError] = useState(false);

  // Initialize with default value
  useEffect(() => {
    setSelectedAmenities(value);
  }, [value]);

  const handleAmenityChange = (amenityValue) => {
    let newSelection;
    if (selectedAmenities.includes(amenityValue)) {
      newSelection = selectedAmenities.filter(item => item !== amenityValue);
    } else {
      newSelection = [...selectedAmenities, amenityValue];
    }

    setSelectedAmenities(newSelection);
    setError(required && newSelection.length === 0);
    
    // Simulate event object for consistency with other form inputs
    onChange({
      target: {
        name,
        value: newSelection
      }
    });
  };


  return (
    <div className={`amenities-group ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity) => (
          <div
            key={amenity.value || amenity.name}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedAmenities.includes(amenity.value || amenity.name)
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleAmenityChange(amenity.value || amenity.name)}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity.value || amenity.name)}
                onChange={() => {}}
                className="hidden"
              />
              <div className={`w-5 h-5 flex items-center justify-center mr-3 rounded ${
                selectedAmenities.includes(amenity.value || amenity.name)
                  ? "bg-green-500 text-white"
                  : "border border-gray-300"
              }`}>
                {selectedAmenities.includes(amenity.value || amenity.name) && (
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex items-center">
             
                <span className="text-sm font-medium text-gray-700">
                  {amenity.label || amenity.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          Please select at least one amenity
        </p>
      )}
    </div>
  );
};

export default EnhancedCheckbox;