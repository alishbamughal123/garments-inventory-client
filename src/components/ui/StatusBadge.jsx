import { cn } from "../../utils/cn";
import { useLanguage } from "../../context/LanguageContext";

const badgeVariants = {
  ACTIVE:
    "bg-emerald-50 text-emerald-700",
  INACTIVE:
    "bg-slate-100 text-slate-600",
  VIP:
    "bg-violet-50 text-violet-700",
  WHOLESALE:
    "bg-amber-50 text-amber-700",
  REGULAR:
    "bg-blue-50 text-blue-700",
  NEW: "bg-sky-50 text-sky-700",
  CONTACTED:
    "bg-indigo-50 text-indigo-700",
  QUALIFIED:
    "bg-brand-50 text-brand-700",
  PROPOSAL_SENT:
    "bg-amber-50 text-amber-700",
  NEGOTIATION:
    "bg-orange-50 text-orange-700",
  WON:
    "bg-emerald-50 text-emerald-700",
  LOST:
    "bg-red-50 text-red-700",
  CALL: "bg-brand-50 text-brand-700",
  EMAIL:
    "bg-indigo-50 text-indigo-700",
  MEETING:
    "bg-emerald-50 text-emerald-700",
  NOTE: "bg-slate-100 text-slate-700",
  FOLLOW_UP:
    "bg-amber-50 text-amber-700",
  APPOINTMENT:
    "bg-violet-50 text-violet-700",
  OUTBOUND:
    "bg-blue-50 text-blue-700",
  INBOUND:
    "bg-emerald-50 text-emerald-700",
  DRAFT:
    "bg-slate-100 text-slate-700",
  SENT: "bg-sky-50 text-sky-700",
  OPENED:
    "bg-emerald-50 text-emerald-700",
  REPLIED:
    "bg-indigo-50 text-indigo-700",
  RECEIVED:
    "bg-brand-50 text-brand-700",
  FAILED:
    "bg-red-50 text-red-700",
  PENDING:
    "bg-amber-50 text-amber-700",
  IN_PROGRESS:
    "bg-sky-50 text-sky-700",
  COMPLETED:
    "bg-emerald-50 text-emerald-700",
  CANCELLED:
    "bg-red-50 text-red-700",
  OVERDUE:
    "bg-red-50 text-red-700",
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM:
    "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT:
    "bg-red-100 text-red-700",
  USABLE:
    "bg-emerald-50 text-emerald-700",
  DAMAGED:
    "bg-red-50 text-red-700",
  REFURBISHED:
    "bg-amber-50 text-amber-700",
};

const StatusBadge = ({
  value,
  className,
}) => {
  const { t } = useLanguage();
  const rawText = String(value || "-").replaceAll("_", " ");
  const translated = t(value) !== value ? t(value) : t(rawText);

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        badgeVariants[value] ||
          "bg-slate-100 text-slate-600",
        className
      )}
    >
      {translated}
    </span>
  );
};

export default StatusBadge;
