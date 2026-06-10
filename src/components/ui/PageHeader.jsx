import Button from "./Button";
import { cn } from "../../utils/cn";

const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
  className,
}) => {
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
            {eyebrow}
          </p>
        )}

        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-start lg:justify-end">
          {action}
        </div>
      )}
    </section>
  );
};

PageHeader.Action = Button;

export default PageHeader;
