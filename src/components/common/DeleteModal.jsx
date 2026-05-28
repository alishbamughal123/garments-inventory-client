const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure?"
}) => {
  if (!isOpen) return null;

  return (
    <div className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
    ">
      <div className="
        bg-white
        rounded-2xl
        w-full
        max-w-md
        p-6
        shadow-xl
      ">
        <h2 className="
          text-xl
          font-semibold
          text-slate-900
          mb-3
        ">
          {title}
        </h2>

        <p className="
          text-slate-600
          mb-6
        ">
          {message}
        </p>

        <div className="
          flex
          justify-end
          gap-3
        ">
          <button
            onClick={onClose}
            className="
              px-4
              py-2
              rounded-xl
              border
              border-slate-300
              text-slate-600
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4
              py-2
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;