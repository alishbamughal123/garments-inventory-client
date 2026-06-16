import {
  useEffect,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import {
  BadgeDollarSign,
  CircleDollarSign,
  Landmark,
  TrendingUp,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import ReportTabs from "../../components/reports/ReportTabs";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportKpiCard from "../../components/reports/ReportKpiCard";
import ReportChartCard from "../../components/reports/ReportChartCard";
import {
  formatCurrency,
  formatLabel,
  reportChartColors,
} from "../../components/reports/reportFormatters";
import {
  getRevenueAnalytics,
} from "../../services/reports.service";

const initialFilters = {
  from: "",
  to: "",
  customerType: "",
};

const RevenueAnalyticsPage = () => {
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
            await getRevenueAnalytics(
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
                "Failed to load revenue analytics"
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

  const expectedRevenue =
    analytics?.expectedRevenue || 0;
  const closedRevenue =
    analytics?.closedRevenue || 0;
  const realizationRate =
    expectedRevenue > 0
      ? (
          (closedRevenue /
            expectedRevenue) *
          100
        ).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Business Intelligence"
        title="Revenue Intelligence"
        description="Analyze revenue trajectories, realization rates, and commercial performance across customer segments."
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
          Loading revenue analytics...
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportKpiCard
              title="Expected Revenue"
              value={formatCurrency(
                expectedRevenue
              )}
              subtitle="Open pipeline potential"
              icon={Landmark}
              tone="blue"
            />
            <ReportKpiCard
              title="Closed Revenue"
              value={formatCurrency(
                closedRevenue
              )}
              subtitle="Sales already captured"
              icon={BadgeDollarSign}
              tone="emerald"
            />
            <ReportKpiCard
              title="Revenue Realization"
              value={`${realizationRate}%`}
              subtitle="Closed revenue relative to expected pipeline"
              icon={TrendingUp}
              tone="amber"
            />
            <ReportKpiCard
              title="Revenue Gap"
              value={formatCurrency(
                Math.max(
                  expectedRevenue -
                    closedRevenue,
                  0
                )
              )}
              subtitle="Remaining opportunity in pipeline"
              icon={CircleDollarSign}
              tone="violet"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <ReportChartCard
              title="Revenue by Month"
              description="Closed revenue trend over time"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      analytics?.revenueByMonth ||
                      []
                    }
                  >
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
                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>

            <ReportChartCard
              title="Revenue by Customer Type"
              description="Contribution split by customer segment"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        analytics?.revenueByCustomerType ||
                        []
                      }
                      dataKey="revenue"
                      nameKey="type"
                      innerRadius={70}
                      outerRadius={110}
                    >
                      {(
                        analytics?.revenueByCustomerType ||
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
                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>
          </section>

          <ReportChartCard
            title="Revenue by Customer Type"
            description="Bar view for quick executive comparison"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    analytics?.revenueByCustomerType ||
                    []
                  }
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="type"
                    tickFormatter={formatLabel}
                    stroke="#64748b"
                  />
                  <YAxis
                    stroke="#64748b"
                  />
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    radius={[
                      12, 12, 0, 0,
                    ]}
                  >
                    {(
                      analytics?.revenueByCustomerType ||
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
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ReportChartCard>
        </>
      )}
    </div>
  );
};

export default RevenueAnalyticsPage;
