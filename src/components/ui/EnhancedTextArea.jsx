import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const EnhancedEditor = ({
  value,
  onChange,
  placeholder,
  name,
  error,
  label,
  withToolbar = false, 
  ...rest
}) => {
  // modules config depends on `withToolbar`
 const modules = withToolbar
  ? {
      toolbar: [
        [{ header: [1, 2, 3, false] }], // headers
        ["bold", "italic", "underline", "strike"], // basic styles
        [{ list: "ordered" }, { list: "bullet" }], // lists
        ["blockquote", "code-block"], // special blocks
        ["link", "image"], // media
        [{ color: [] }, { background: [] }], // text & background colors
        [{ align: [] }], // alignment
        ["clean"], // remove formatting
      ],
    }
  : { toolbar: false };

  return (
    <div>
      <div className="relative">
        {label && (
          <label
            htmlFor={label || name}
            className="block text-sm font-medium text-primary-text mb-1 capitalize dark:text-gray-200"
          >
            {label}
          </label>
        )}

        <ReactQuill
          value={value}
          modules={modules}
          onChange={(content) =>
            onChange({ target: { name, value: content } })
          }
          placeholder={placeholder}
          className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-700 focus-within:border-main-green focus-within:ring-main-green dark:placeholder:text-gray-200"
          theme="snow"
          {...rest}
        />
      </div>

      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default EnhancedEditor;
