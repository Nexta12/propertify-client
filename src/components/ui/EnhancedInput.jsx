import { useState, useEffect, useCallback } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const EnhancedInput = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  required = false,
  validate,
  forceValidate = false,
  errorMessage,
  placeholder,
 maxLength,
  className,
}) => {
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const defaultValidators = {
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    password: (val) => val?.length >= 8,
  };

  const validateInput = useCallback(
    (val) => {
      let isValid = true;

      if (required && !val?.trim()) {
        isValid = false;
      } else if (defaultValidators[type]) {
        isValid = defaultValidators[type](val);
      } else if (validate) {
        isValid = validate(val);
      }

      setError(!isValid);
      return isValid;
    },
    [required, type, validate]
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

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(e);
    if (touched) validateInput(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    if (type === "email") return "Please enter a valid email";
    if (type === "password") return "Password must be at least 8 characters";
    return "This field is required";
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  const baseClasses =
    " w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#28B16D] focus:border-transparent text-sm font-medium placeholder:text-neutral-400 ";

  return (
    <div className={`input-group relative ${className} w-full`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 capitalize"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {type === "password" && (
          <>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-[#8E9395]" />
            </div>

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {!showPassword ? (
                <FiEye className="text-[#8E9395] hover:text-[#0a0a0a]" />
              ) : (
                <FiEyeOff className="text-[#8E9395] hover:text-[#0a0a0a]" />
              )}
            </button>
          </>
        )}

        {type === "email" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-[#8E9395]" />
          </div>
        )}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`${
            type === "email" || type === "password" ? "pl-10" : ""
          } ${baseClasses} ${error ? "border-red-500" : "border-gray-300"} `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{getErrorMessage()}</p>
      )}
    </div>
  );
};

export default EnhancedInput;
