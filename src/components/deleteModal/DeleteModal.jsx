
const DeleteModal = ({isOpen,onClose,onConfirm,message,isDeleting, confirmText, onAction, actTionText, isTakingAction, confirmTextClass}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
      aria-hidden={!isOpen}
      role="dialog"
    >
      <div className="bg-white p-6 rounded-md w-fit">
        <div className="flex flex-col gap-4 text-center">
          <p>{message}</p>
          <div className="flex justify-center gap-4">
            <button
              className="border border-black/15 text-neutral-700 py-1 px-4 rounded-md"
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
              className={`text-red-500 border  border-black/15 py-1 px-4 rounded-md ${confirmTextClass} `}
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
