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
// };

// export default DashboardPage;
import { useEffect, useState } from "react";

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

import {
  getDashboardData,
} from "../../services/dashboard.service";

const DashboardPage = () => {
  const [loading, setLoading] =
    useState(true);

  const [dashboard, setDashboard] =
    useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const response =
          await getDashboardData();

        setDashboard(
          response.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10">
          Loading Dashboard...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Inventory Overview
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Total Products"
          value={dashboard.totalProducts}
          icon={
            <FiBox
              size={22}
              className="text-blue-600"
            />
          }
          
        />

        <StatCard
          title="Total Stock"
          value={dashboard.totalStock}
          icon={
            <FiLayers
              size={22}
              className="text-emerald-600"
            />
          }
         
        />

        <StatCard
          title="Inventory Value"
          value={`Rs ${Number(
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
          title="Healthy Products"
          value={
            dashboard.healthyProducts
          }
          icon={
            <FiCheckCircle
              size={22}
              className="text-green-600"
            />
          }
          
        />

        <StatCard
          title="Low Stock"
          value={dashboard.lowStockItems}
          icon={
            <FiAlertTriangle
              size={22}
              className="text-amber-600"
            />
          }
        
        />

        <StatCard
          title="Out Of Stock"
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
        <LowStockTable
          products={
            dashboard.topLowStockProducts
          }
        />
      </div>

      {/* Transactions */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

        <h2 className="text-xl font-semibold mb-5">
          Recent Transactions
        </h2>

        <table className="w-full">

          <thead>

            <tr className="text-slate-500 text-sm">

              <th className="text-left py-3">
                Product
              </th>

              <th className="text-left py-3">
                Type
              </th>

              <th className="text-left py-3">
                Qty
              </th>

            </tr>

          </thead>

          <tbody>

            {dashboard.recentTransactions?.map(
              (item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition"
                >

                  <td className="py-4">
                    {
                      item.product
                        ?.productName
                    }
                  </td>

                  <td>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium

                        ${
                          item.transactionType ===
                          "STOCK_IN"
                            ? "bg-blue-50 text-blue-600"
                            : item.transactionType ===
                              "STOCK_OUT"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-green-50 text-green-600"
                        }
                      `}
                    >
                      {
                        item.transactionType
                      }
                    </span>

                  </td>

                  <td>
                    {item.quantity}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* Returns */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-5">
          Recent Returns
        </h2>

        <table className="w-full">

          <thead>

            <tr className="text-slate-500 text-sm">

              <th className="text-left py-3">
                Product
              </th>

              <th className="text-left py-3">
                Quantity
              </th>

            </tr>

          </thead>

          <tbody>

            {dashboard.recentReturns?.map(
              (item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition"
                >

                  <td className="py-4">
                    {
                      item.product
                        ?.productName
                    }
                  </td>

                  <td>
                    {
                      item.returnQuantity
                    }
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </MainLayout>
  );
};

export default DashboardPage;