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
            <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 pt-1 text-sm font-medium text-slate-500">
                    {t(title)}
                </p>

                <div className={`${bg || "bg-slate-50"} shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl`}>
                    {icon}
                </div>
            </div>

            <h2 className="mt-3 text-2xl xl:text-xl 2xl:text-2xl font-bold text-slate-900 tabular-nums whitespace-nowrap">
                {value}
            </h2>
        </div>
    );
};

export default StatCard;
