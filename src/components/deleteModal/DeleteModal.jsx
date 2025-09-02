
import { motion as Motion } from "framer-motion";
import { AiOutlineWarning } from "react-icons/ai";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  isDeleting,
  confirmText,
  onAction,
  actTionText,
  isTakingAction,
  confirmTextClass,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-hidden={!isOpen}
      role="dialog"
    >
      <Motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md"
      >
        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-full">
            <AiOutlineWarning className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Are you sure?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          {actTionText && (
            <button
              type="button"
              onClick={onAction}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 
                         dark:bg-blue-500 dark:hover:bg-blue-600 transition shadow-md"
            >
              {isTakingAction ? "Please wait..." : actTionText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 
                        dark:bg-red-600 dark:hover:bg-red-700 transition shadow-md ${confirmTextClass}`}
          >
            {isDeleting ? "Please wait..." : confirmText ? confirmText : "Delete"}
          </button>
        </div>
      </Motion.div>
    </div>
  );
};

export default DeleteModal;


