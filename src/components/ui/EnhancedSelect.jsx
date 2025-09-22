import { useState, useEffect, useCallback } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const validateInput = useCallback(
    (val) => {
      let isValid = true;

      if (required && (!val || val === "")) {
        isValid = false;
      } else if (validate) {
        isValid = validate(val);
      }

      setError(!isValid);
      return isValid;
    },
    [required, validate] // 👈 dependencies
  );

  useEffect(() => {
    if (touched || forceValidate) {
      validateInput(value);
    }
  }, [value, touched, forceValidate, validateInput]);

  const handleBlur = () => {
    setTouched(true);
    validateInput(value);
  };

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setIsOpen(false);
    if (touched) validateInput(val);
  };

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    return "This field is required";
  };

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Custom select box */}
      <div
        className={`mt-1 block w-full rounded-md border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 cursor-pointer`}
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={handleBlur}
        tabIndex={0}
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder || "Select an option"}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Search box */}
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          {/* Options */}
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === opt.value ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
                  }`}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage()}</p>}
    </div>
  );
};

export default EnhancedSelect;
