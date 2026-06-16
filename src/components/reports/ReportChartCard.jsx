import SurfaceCard from "../ui/SurfaceCard";

const ReportChartCard = ({
  title,
  description,
  children,
  className = "",
}) => (
  <SurfaceCard
    className={`p-5 sm:p-6 ${className}`}
  >
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-slate-950">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      ) : null}
    </div>

    {children}
  </SurfaceCard>
);

export default ReportChartCard;
