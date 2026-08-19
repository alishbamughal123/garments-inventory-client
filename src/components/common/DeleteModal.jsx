import Button from "../ui/Button";
import { useLanguage } from "../../context/LanguageContext";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  const { t, isNo } = useLanguage();
  if (!isOpen) return null;

  const displayTitle = title ? (typeof title === "string" ? t(title) : title) : (isNo ? "Slett element" : "Delete Item");
  const displayMessage = message ? (typeof message === "string" ? t(message) : message) : (isNo ? "Er du sikker på at du vil slette dette?" : "Are you sure you want to delete this?");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">
          {displayTitle}
        </h2>

        <p className="text-slate-600 mb-6 text-sm">
          {displayMessage}
        </p>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">
            {t("cancel")}
          </Button>

          <Button onClick={onConfirm} variant="danger">
            {t("delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
