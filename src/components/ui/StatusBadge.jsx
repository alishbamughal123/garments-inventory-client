import { cn } from "../../utils/cn";

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
    "bg-cyan-50 text-cyan-700",
  PROPOSAL_SENT:
    "bg-amber-50 text-amber-700",
  NEGOTIATION:
    "bg-orange-50 text-orange-700",
  WON:
    "bg-emerald-50 text-emerald-700",
  LOST:
    "bg-rose-50 text-rose-700",
};

const StatusBadge = ({
  value,
  className,
}) => (
  <span
    className={cn(
      "rounded-full px-3 py-1 text-xs font-medium",
      badgeVariants[value] ||
        "bg-slate-100 text-slate-600",
      className
    )}
  >
    {String(value || "-").replaceAll(
      "_",
      " "
    )}
  </span>
);

export default StatusBadge;
