import { useLanguage } from "../../context/LanguageContext";

const StatCard = ({
    title,
    value,
    icon,
    bg,
}) => {
    const { t } = useLanguage();
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 transition hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500 truncate">
                        {t(title)}
                    </p>

                    <h2
                        title={typeof value === "string" ? value : undefined}
                        className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums truncate"
                    >
                        {value}
                    </h2>
                </div>

                <div className={`${bg || "bg-slate-50"} shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
