
import { useState, useEffect } from "react";

const EnhancedSelect = ({
  name,
  label,
  value,
  onChange,
  required = false,
  options = [],
  validate,
  forceValidate = false,
  errorMessage,
  placeholder,
}) => {
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || forceValidate) {
      validateInput(value);
    }
  }, [value, touched, forceValidate]);

  const validateInput = (val) => {
    let isValid = true;

    if (required && (!val || val === "")) {
      isValid = false;
    } else if (validate) {
      isValid = validate(val);
    }

    setError(!isValid);
    return isValid;
  };

  const handleBlur = () => {
    setTouched(true);
    validateInput(value);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(e); // Bubble up to parent
    if (touched) validateInput(value);
  };

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    return "This field is required";
  };

  return (
  <div className="input-group relative">
  {label && (
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  )}
  <div className="relative">
    <select
      id={name}
      name={name}
      value={value || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`mt-1 block w-full rounded-md border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28B16D] focus:border-transparent text-sm font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
    >
      <option value="" disabled hidden>
        {placeholder || "Select an option"}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
  {error && (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {getErrorMessage()}
    </p>
  )}
</div>

  );
};

export default EnhancedSelect;
