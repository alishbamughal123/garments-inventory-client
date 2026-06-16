import {
  useEffect,
  useState,
} from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import {
  DollarSign,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import ReportTabs from "../../components/reports/ReportTabs";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportKpiCard from "../../components/reports/ReportKpiCard";
import ReportChartCard from "../../components/reports/ReportChartCard";
import {
  formatCurrency,
  formatLabel,
  formatNumber,
  reportChartColors,
} from "../../components/reports/reportFormatters";
import {
  getCustomerAnalytics,
} from "../../services/reports.service";

const initialFilters = {
  from: "",
  to: "",
  customerType: "",
};

const CustomerAnalyticsPage = () => {
  const [filters, setFilters] =
    useState(initialFilters);
  const [loading, setLoading] =
    useState(true);
  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics =
      async () => {
        try {
          setLoading(true);
          const response =
            await getCustomerAnalytics(
              filters
            );

          if (isMounted) {
            setAnalytics(
              response.data
            );
          }
        } catch (error) {
          if (isMounted) {
            toast.error(
              error?.response?.data
                ?.message ||
                "Failed to load customer analytics"
            );
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Business Intelligence"
        title="Customer Lifecycle Insights"
        description="Analyze customer segment concentration, acquisition trends, and revenue contribution profiles."
      />

      <ReportTabs />

      <ReportFilters
        filters={filters}
        onChange={(key, value) =>
          setFilters((current) => ({
            ...current,
            [key]: value,
          }))
        }
        onReset={() =>
          setFilters(initialFilters)
        }
        showCustomerType
      />

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Loading customer analytics...
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportKpiCard
              title="Active Customers"
              value={formatNumber(
                analytics?.summary
                  ?.totalActiveCustomers
              )}
              subtitle="Customers marked active"
              icon={UserCheck}
              tone="emerald"
            />
            <ReportKpiCard
              title="Revenue from Customers"
              value={formatCurrency(
                analytics?.summary
                  ?.totalCustomerRevenue
              )}
              subtitle="Closed revenue tied to customer records"
              icon={DollarSign}
              tone="blue"
            />
            <ReportKpiCard
              title="Customer Segments"
              value={formatNumber(
                analytics?.customersByType
                  ?.filter(
                    (item) =>
                      item.count > 0
                  ).length
              )}
              subtitle="Active customer categories in data"
              icon={Users}
              tone="teal"
            />
            <ReportKpiCard
              title="Top Customer Revenue"
              value={formatCurrency(
                analytics
                  ?.topCustomersByRevenue?.[0]
                  ?.revenue
              )}
              subtitle="Highest contributor in selected period"
              icon={TrendingUp}
              tone="amber"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <ReportChartCard
              title="Customers by Type"
              description="Customer segmentation overview"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        analytics?.customersByType ||
                        []
                      }
                      dataKey="count"
                      nameKey="type"
                      innerRadius={70}
                      outerRadius={110}
                    >
                      {(
                        analytics?.customersByType ||
                        []
                      ).map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={
                              entry.type
                            }
                            fill={
                              reportChartColors[
                                index %
                                  reportChartColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>

            <ReportChartCard
              title="Monthly Customer Growth"
              description="New customers added month over month"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      analytics?.monthlyCustomerGrowth ||
                      []
                    }
                  >
                    <defs>
                      <linearGradient
                        id="customerGrowthFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#7c3aed"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="95%"
                          stopColor="#7c3aed"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                    />
                    <YAxis
                      stroke="#64748b"
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="customers"
                      stroke="#7c3aed"
                      fill="url(#customerGrowthFill)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>
          </section>

          <ReportChartCard
            title="Top Customers by Revenue"
            description="Highest-value customer accounts in the selected period"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-slate-100 text-left text-sm text-slate-500">
                  <tr>
                    <th className="pb-3 font-medium">
                      Customer
                    </th>
                    <th className="pb-3 font-medium">
                      Company
                    </th>
                    <th className="pb-3 font-medium">
                      Type
                    </th>
                    <th className="pb-3 font-medium">
                      Orders
                    </th>
                    <th className="pb-3 font-medium">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    analytics?.topCustomersByRevenue ||
                    []
                  ).map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 text-sm text-slate-700"
                    >
                      <td className="py-4 font-medium text-slate-900">
                        {
                          customer.fullName
                        }
                      </td>
                      <td className="py-4">
                        {customer.companyName ||
                          "-"}
                      </td>
                      <td className="py-4">
                        {formatLabel(
                          customer.customerType
                        )}
                      </td>
                      <td className="py-4">
                        {
                          customer.totalOrders
                        }
                      </td>
                      <td className="py-4 font-semibold text-slate-950">
                        {formatCurrency(
                          customer.revenue
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportChartCard>
        </>
      )}
    </div>
  );
};

export default CustomerAnalyticsPage;
