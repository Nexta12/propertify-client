
const DeleteModal = ({isOpen,onClose,onConfirm,message,isDeleting, confirmText, onAction, actTionText, isTakingAction}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
      aria-hidden={!isOpen}
      role="dialog"
    >
      <div className="bg-white p-6 rounded-md w-[90%] md:w-[70%] lg:w-[50%]">
        <div className="flex flex-col gap-4 text-center">
          <p>{message}</p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-main-green text-white py-1 px-4 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>

            {actTionText && ( 
            <button
             type="button"
              className="bg-blue-500 text-white py-1 px-4 rounded-md"
              onClick={onAction}
            >
             {isTakingAction ? "Please wait..." : actTionText}
            </button>
            )}

            <button
             type="button"
              className="bg-red-500 text-white py-1 px-4 rounded-md"
              onClick={onConfirm}
            >
             {isDeleting ? "Please wait..." : confirmText ? confirmText : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
