import {
  useEffect,
  useState,
} from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import {
  Activity,
  CircleSlash2,
  Target,
  TrendingUp,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import ReportTabs from "../../components/reports/ReportTabs";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportKpiCard from "../../components/reports/ReportKpiCard";
import ReportChartCard from "../../components/reports/ReportChartCard";
import {
  formatLabel,
  formatNumber,
  reportChartColors,
} from "../../components/reports/reportFormatters";
import {
  getLeadAnalytics,
} from "../../services/reports.service";

const initialFilters = {
  from: "",
  to: "",
  leadSource: "",
};

const LeadAnalyticsPage = () => {
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
            await getLeadAnalytics(
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
                "Failed to load lead analytics"
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
        title="Pipeline & Lead Intelligence"
        description="Measure lead conversion velocity, acquisition channel efficiency, and pipeline progression dynamics."
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
        showLeadSource
      />

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Loading lead analytics...
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportKpiCard
              title="Total Leads"
              value={formatNumber(
                analytics?.summary
                  ?.totalLeads
              )}
              subtitle="All tracked leads"
              icon={Activity}
              tone="blue"
            />
            <ReportKpiCard
              title="Won Leads"
              value={formatNumber(
                analytics?.summary
                  ?.wonLeads
              )}
              subtitle="Converted opportunities"
              icon={Target}
              tone="emerald"
            />
            <ReportKpiCard
              title="Lost Leads"
              value={formatNumber(
                analytics?.summary
                  ?.lostLeads
              )}
              subtitle="Opportunities dropped"
              icon={CircleSlash2}
              tone="rose"
            />
            <ReportKpiCard
              title="Win Share"
              value={`${(
                ((analytics?.summary
                  ?.wonLeads || 0) /
                  Math.max(
                    analytics?.summary
                      ?.totalLeads || 0,
                    1
                  )) *
                100
              ).toFixed(2)}%`}
              subtitle="Won leads as percentage of total"
              icon={TrendingUp}
              tone="amber"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <ReportChartCard
              title="Leads by Status"
              description="Current stage distribution"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        analytics?.leadsByStatus ||
                        []
                      }
                      dataKey="count"
                      nameKey="status"
                      outerRadius={110}
                    >
                      {(
                        analytics?.leadsByStatus ||
                        []
                      ).map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={
                              entry.status
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
                    <Legend
                      formatter={
                        formatLabel
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>

            <ReportChartCard
              title="Leads by Source"
              description="Acquisition channels driving pipeline"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      analytics?.leadsBySource ||
                      []
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="source"
                      tickFormatter={formatLabel}
                      stroke="#64748b"
                    />
                    <YAxis
                      stroke="#64748b"
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      radius={[
                        12, 12, 0, 0,
                      ]}
                      fill="#2563eb"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>

            <ReportChartCard
              title="Monthly Lead Creation Trend"
              description="New opportunities created by month"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      analytics?.monthlyLeadCreationTrend ||
                      []
                    }
                  >
                    <defs>
                      <linearGradient
                        id="leadTrendFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0f766e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0f766e"
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
                      dataKey="count"
                      stroke="#0f766e"
                      fill="url(#leadTrendFill)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>

            <ReportChartCard
              title="Lead Conversion Funnel"
              description="Stage-by-stage opportunity progression"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      analytics?.leadConversionFunnel ||
                      []
                    }
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      type="number"
                      stroke="#64748b"
                    />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      width={120}
                      tickFormatter={formatLabel}
                      stroke="#64748b"
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      radius={[
                        0, 12, 12, 0,
                      ]}
                    >
                      {(
                        analytics?.leadConversionFunnel ||
                        []
                      ).map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={
                              entry.stage
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
          </section>
        </>
      )}
    </div>
  );
};

export default LeadAnalyticsPage;
