import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: false,
};
//  const modules = {
//    toolbar: [
//     ['bold', 'italic']
//   ],
//  }

const EnhancedEditor = ({
  value,
  onChange,
  placeholder,
  name,
  error,
  label,
  ...rest
}) => {
  return (
    <div className="mb-8">
  <div className="relative">
    <label
      htmlFor={label || name}
      className="block text-sm font-medium text-primary-text mb-1 capitalize dark:text-gray-200"
    >
      {label || name}
    </label>
    <ReactQuill
      value={value}
      modules={modules}
      onChange={(content) => onChange({ target: { name, value: content } })}
      placeholder={placeholder}
      className="bg-white dark:bg-gray-800  dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-700 focus-within:border-main-green focus-within:ring-main-green dark:placeholder:text-gray-200"
      theme="snow"
      {...rest}
    />
  </div>
  {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
</div>

  );
};

export default EnhancedEditor;
