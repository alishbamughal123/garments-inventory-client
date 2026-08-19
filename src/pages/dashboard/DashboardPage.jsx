// import {
//     useEffect,
//     useState,
// } from "react";
// import {
//     FiBox,
//     FiLayers,
//     FiAlertTriangle,
//     FiXCircle,
// } from "react-icons/fi";
// import { FiArchive } from "react-icons/fi";

// import MainLayout from "../../layouts/MainLayout";

// import StatCard from "../../components/dashboard/StatCard";

// import { getDashboardData } from "../../services/dashboard.service";

// const DashboardPage = () => {
//     const [loading, setLoading] =
//         useState(true);

//     const [dashboard, setDashboard] =
//         useState(null);

//     useEffect(() => {
//         fetchDashboard();
//     }, []);

//     const fetchDashboard =
//         async () => {
//             try {
//                 const response =
//                     await getDashboardData();

//                 setDashboard(
//                     response.data
//                 );
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//     if (loading) {
//         return (
//             <div className="p-10">
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <MainLayout>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

//                 <StatCard
//                     title="Total Products"
//                     value={dashboard.totalProducts}
//                     icon={
//                         <FiBox
//                             size={24}
//                             className="text-blue-600"
//                         />
//                     }

//                 />

//                 <StatCard
//                     title="Total Stock"
//                     value={dashboard.totalStock}
//                     icon={
//                         <FiLayers
//                             size={24}
//                             className="text-emerald-600"
//                         />
//                     }

//                 />

//                 <StatCard
//                     title="Low Stock"
//                     value={dashboard.lowStockItems}
//                     icon={
//                         <FiAlertTriangle
//                             size={24}
//                             className="text-amber-600"
//                         />
//                     }

//                 />

//                 <StatCard
//                     title="Out Of Stock"
//                     value={dashboard.outOfStockItems}
//                     icon={
//                         <FiArchive
//                             size={24}
//                             className="text-slate-600"
//                         />
//                     }


//                 />

//             </div>

//             {/* Transactions */}

//             <div className="bg-white rounded-xl shadow p-6 mb-8">

//                 <h2 className="font-bold text-xl mb-4">
//                     Recent Transactions
//                 </h2>

//                 <table className="w-full border-separate border-spacing-y-2">
//                     <thead>
//                         <tr className="hover:bg-slate-50 transition">
//                             <th className="text-left py-2">
//                                 Product
//                             </th>

//                             <th className="text-left py-2">
//                                 Type
//                             </th>

//                             <th className="text-left py-2">
//                                 Qty
//                             </th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {dashboard.recentTransactions?.map(
//                             (item) => (
//                                 <tr
//                                     key={item.id}
//                                     className="border-b"
//                                 >
//                                     <td className="py-2">
//                                         {
//                                             item.product
//                                                 ?.productName
//                                         }
//                                     </td>

//                                     <td>
//                                         {item.transactionType === "STOCK_IN" && (
//                                             <span className="px-3 py-1 rounded-full  text-blue-600 text-sm">
//                                                 STOCK IN
//                                             </span>
//                                         )}

//                                         {item.transactionType === "STOCK_OUT" && (
//                                             <span className="px-3 py-1 rounded-full  text-orange-600 text-sm">
//                                                 STOCK OUT
//                                             </span>
//                                         )}

//                                         {item.transactionType === "RETURN" && (
//                                             <span className="px-3 py-1 rounded-full  text-green-600 text-sm">
//                                                 RETURN
//                                             </span>
//                                         )}
//                                     </td>

//                                     <td className="py-2">
//                                         {item.quantity}
//                                     </td>
//                                 </tr>
//                             )
//                         )}
//                     </tbody>

//                 </table>

//             </div>

//             {/* Returns */}

//             <div className="bg-white rounded-xl shadow p-6 mb-8">

//                 <h2 className="font-bold text-xl mb-4">
//                     Recent Returns
//                 </h2>

//                 <table className="w-full">

//                     <thead>
//                         <tr className="border-b">

//                             <th className="text-left py-2">
//                                 Product
//                             </th>

//                             <th className="text-left py-2">
//                                 Quantity
//                             </th>

//                         </tr>
//                     </thead>

//                     <tbody>
//                         {dashboard.recentReturns?.map(
//                             (item) => (
//                                 <tr
//                                     key={item.id}
//                                     className="border-b"
//                                 >
//                                     <td className="py-2">
//                                         {
//                                             item.product
//                                                 ?.productName
//                                         }
//                                     </td>

//                                     <td className="py-2">
//                                         {
//                                             item.returnQuantity
//                                         }
//                                     </td>
//                                 </tr>
//                             )
//                         )}
//                     </tbody>

//                 </table>

//             </div>

//             {/* Low Stock */}

//             <div className="bg-white rounded-xl shadow p-6">

//                 <h2 className="font-bold text-xl mb-4">
//                     Low Stock Products
//                 </h2>

//                 <table className="w-full">

//                     <thead>
//                         <tr className="border-b">

//                             <th className="text-left py-2">
//                                 Product
//                             </th>

//                             <th className="text-left py-2">
//                                 Stock
//                             </th>

//                         </tr>
//                     </thead>

//                     <tbody>
//                         {dashboard.lowStockProducts?.map(
//                             (item) => (
//                                 <tr
//                                     key={item.id}
//                                     className="border-b"
//                                 >
//                                     <td className="py-2">
//                                         {item.productName}
//                                     </td>

//                                     <td className="py-2">
//                                         {item.stockQuantity}
//                                     </td>
//                                 </tr>
//                             )
//                         )}
//                     </tbody>

//                 </table>

//             </div>

//         </MainLayout>
//     );
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  FiBox,
  FiLayers,
  FiAlertTriangle,
  FiArchive,
  FiCheckCircle,
} from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import LowStockTable from "../../components/dashboard/LowStockTable";
import TaskSummaryCards from "../../components/tasks/TaskSummaryCards";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useLanguage } from "../../context/LanguageContext";

import {
  getDashboardData,
} from "../../services/dashboard.service";
import { getTasks } from "../../services/task.service";

const DashboardPage = () => {
  const { t, lang, isNo } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [taskSummary, setTaskSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [
          dashboardResult,
          tasksResult,
        ] = await Promise.allSettled([
          getDashboardData(),
          getTasks({
            includeSummary: "true",
          }),
        ]);

        if (isMounted) {
          if (dashboardResult.status === "fulfilled") {
            setDashboard(dashboardResult.value.data);
          } else {
            toast.error(isNo ? "Kunne ikke laste oversiktsdata" : "Failed to load dashboard data");
          }

          if (tasksResult.status === "fulfilled") {
            setTaskSummary(tasksResult.value.data.summary);
          } else {
            console.log(tasksResult.reason);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isNo]);

  if (loading) {
    return (
      <MainLayout>
        <Loader message={isNo ? "Synkroniserer nøkkeltall..." : "Syncing operational metrics..."} />
      </MainLayout>
    );
  }

  if (!dashboard) {
    return (
      <MainLayout>
        <div className="p-10 text-slate-500 font-semibold">
          {isNo ? "Kan ikke laste oversikten akkurat nå." : "Unable to load dashboard right now."}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {t("dashboardTitle")}
        </h1>
        <p className="text-slate-500">
          {t("dashboardSubtitle")}
        </p>
      </div>

      <div className="mb-8">
        <TaskSummaryCards summary={taskSummary} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={t("totalArticles")}
          value={dashboard.totalProducts}
          icon={
            <FiBox
              size={22}
              className="text-[var(--color-primary-ink)]"
            />
          }
        />

        <StatCard
          title={t("totalStock")}
          value={dashboard.totalStock}
          icon={
            <FiLayers
              size={22}
              className="text-emerald-600"
            />
          }
        />

        <StatCard
          title={t("inventoryValue")}
          value={`NOK ${Number(
            dashboard.inventoryValue || 0
          ).toLocaleString()}`}
          icon={
            <FiArchive
              size={22}
              className="text-violet-600"
            />
          }
        />

        <StatCard
          title={isNo ? "Friske artikler" : "Healthy Articles"}
          value={dashboard.healthyProducts}
          icon={
            <FiCheckCircle
              size={22}
              className="text-green-600"
            />
          }
        />

        <StatCard
          title={t("lowStockItems")}
          value={dashboard.lowStockItems}
          icon={
            <FiAlertTriangle
              size={22}
              className="text-amber-600"
            />
          }
        />

        <StatCard
          title={t("outOfStock")}
          value={dashboard.outOfStockItems}
          icon={
            <FiArchive
              size={22}
              className="text-slate-600"
            />
          }
        />
      </div>

      {/* Low Stock */}
      <div className="mb-8">
        <LowStockTable products={dashboard.topLowStockProducts} />
      </div>

      {/* Transactions */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-5 text-slate-900">
          {t("recentTransactions")}
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-100">
                <th className="py-3 font-semibold">{t("product")}</th>
                <th className="py-3 font-semibold">{t("type")}</th>
                <th className="py-3 font-semibold text-right">{t("quantity")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {dashboard.recentTransactions?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400 text-sm">
                    {t("noData")}
                  </td>
                </tr>
              ) : (
                dashboard.recentTransactions?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 font-semibold text-slate-800">
                      {item.product?.productName || "Article"}
                      <span className="block text-xs font-mono text-slate-400 font-normal">
                        {item.product?.sku}
                      </span>
                    </td>
                    <td>
                      <StatusBadge value={item.transactionType} />
                    </td>
                    <td className="py-4 text-right font-bold text-slate-900">
                      {item.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Returns */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-5 text-slate-900">
          {t("recentReturns")}
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-[520px] w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-100">
                <th className="py-3 font-semibold">{t("product")}</th>
                <th className="py-3 font-semibold text-right">{t("quantity")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {dashboard.recentReturns?.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-6 text-center text-slate-400 text-sm">
                    {t("noData")}
                  </td>
                </tr>
              ) : (
                dashboard.recentReturns?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 font-semibold text-slate-800">
                      {item.product?.productName || "Article"}
                    </td>
                    <td className="py-4 text-right font-bold text-slate-900">
                      {item.returnQuantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
