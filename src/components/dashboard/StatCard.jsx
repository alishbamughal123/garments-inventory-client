import { useLanguage } from "../../context/LanguageContext";

const StatCard = ({
    title,
    value,
    icon,
    bg,
}) => {
    const { t } = useLanguage();
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {t(title)}
                    </p>

                    <h2 className="text-4xl font-bold mt-2 text-slate-900">
                        {value}
                    </h2>
                </div>

                <div className={`${bg || "bg-slate-50"} p-4 rounded-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;