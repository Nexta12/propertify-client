import { promotionTypes } from "@utils/data";

const Step2AdType = ({ formData, setFormData }) => {
  const isProperty = formData.post.isProperty;

  const handleSelect = (type) => {
    setFormData({ ...formData, promotionType: type });
  };

  // filter: if not property, remove "featured"
  const availableTypes = promotionTypes.filter((type) => isProperty || type.id !== "featured");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {availableTypes.map((type) => (
        <div
          key={type.id}
          onClick={() => handleSelect(type)}
          className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 ${
            formData.promotionType?.id === type.id
              ? "border-blue-500"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="text-2xl mb-2 text-blue-500">
            <type.icon />
          </div>
          <h3 className="font-medium text-gray-800 dark:text-white">{type.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{type.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Step2AdType;
