import { cn } from "../../utils/cn";

const tones = {
  blue: "border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white text-blue-700",
  teal: "border-teal-100 bg-gradient-to-br from-teal-50 via-white to-white text-teal-700",
  amber: "border-amber-100 bg-gradient-to-br from-amber-50 via-white to-white text-amber-700",
  emerald:
    "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white text-emerald-700",
  rose: "border-rose-100 bg-gradient-to-br from-rose-50 via-white to-white text-rose-700",
  violet:
    "border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white text-violet-700",
};

const ReportKpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "blue",
}) => (
  <article
    className={cn(
      "rounded-3xl border p-5 shadow-sm",
      tones[tone]
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>
        <p className="mt-3 text-3xl font-semibold text-slate-950">
          {value}
        </p>
        {subtitle ? (
          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {Icon ? (
        <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
          <Icon size={20} />
        </div>
      ) : null}
    </div>
  </article>
);

export default ReportKpiCard;
