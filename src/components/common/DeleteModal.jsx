import Button from "../ui/Button";

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
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            variant="danger"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
