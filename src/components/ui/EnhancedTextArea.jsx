
import { useState, useEffect, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";

const EnhancedTextarea = ({
  name,
  label,
  value,
  onChange,
  required = false,
  validate,
  forceValidate = false,
  errorMessage,
  placeholder,
}) => {
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isTinyMCELoaded, setIsTinyMCELoaded] = useState(true);

  const defaultValidators = {
    text: (val) => val?.trim().length > 0,
  };

  const validateInput = useCallback(
    (val) => {
      let isValid = true;

      if (required && !val?.trim()) {
        isValid = false;
      } else if (defaultValidators.text && !defaultValidators.text(val)) {
        isValid = false;
      } else if (validate) {
        isValid = validate(val);
      }

      setError(!isValid);
      return isValid;
    },
    [required, validate]
  );

  useEffect(() => {
    if (touched || forceValidate) {
      validateInput(value);
    }
  }, [value, touched, forceValidate, validateInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // setIsTinyMCELoaded(true);
    }, 10000); // Increased to 10 seconds
    return () => clearTimeout(timeout);
  }, []);

  const handleBlur = () => {
    setTouched(true);
    validateInput(value);
  };

  const handleEditorChange = (content) => {
    onChange({
      target: {
        name,
        value: content,
      },
    });
    if (touched) validateInput(content);
  };

  const handleTextareaChange = (e) => {
    onChange(e);
    if (touched) validateInput(e.target.value);
  };

  const getErrorMessage = () => errorMessage || "This field is required";

  return (
    <div className="my-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`relative border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md`}
      >
        {isTinyMCELoaded ? (
          <Editor
           apiKey={import.meta.env.VITE_TINY_MCE_KEY}
            className="tinymce-editor"
            value={value}
            name={name}
            init={{
              tinymceScriptSrc: "./tinymce/tinymce.min.js",
              height: 300,
              menubar: false,
              plugins: [
                "anchor",
                "autolink",
                "charmap",
                "emoticons",
                "image",
                "link",
                "lists",
                "media",
                "autoresize",
              ],
              toolbar:
                "undo redo | bold italic underline | emoticons | alignleft aligncenter alignright | bullist numlist | link",
              autoresize_bottom_margin: 10,
              min_height: 250,
              max_height: 350,
              setup: (editor) => {
                console.log("TinyMCE setup callback triggered", editor);
              },
            }}
            onEditorChange={handleEditorChange}
            onBlur={handleBlur}
            onInit={(evt, editor) => {
              if (!editor || !editor.getContainer()) {
    
                setIsTinyMCELoaded(false);
              } else {
                console.log("TinyMCE initialized successfully");
              }
            }}
            placeholder={placeholder}
          />
        ) : (
          <>
           
            <textarea
              name={name}
              value={value}
              onChange={handleTextareaChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="w-full p-2 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minHeight: "250px", maxHeight: "350px", resize: "vertical" }}
            />
          </>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{getErrorMessage()}</p>
      )}
    </div>
  );
};

export default EnhancedTextarea;