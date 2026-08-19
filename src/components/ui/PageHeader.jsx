import Button from "./Button";
import { cn } from "../../utils/cn";
import { useLanguage } from "../../context/LanguageContext";

const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  description = subtitle,
  action,
  children,
  className,
}) => {
  const { t } = useLanguage();

  const actionContent = action || children;

  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            {typeof eyebrow === "string" ? t(eyebrow) : eyebrow}
          </p>
        )}

        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {typeof title === "string" ? t(title) : title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {typeof description === "string" ? t(description) : description}
          </p>
        )}
      </div>

      {actionContent && (
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-start lg:justify-end">
          {actionContent}
        </div>
      )}
    </section>
  );
};

PageHeader.Action = Button;

export default PageHeader;
