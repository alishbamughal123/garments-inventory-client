import {
  useEffect,
  useState,
} from "react";
import {
  Link,
} from "react-router-dom";
import {
  Activity,
  BadgeDollarSign,
  BriefcaseBusiness,
  ChartSpline,
  CircleDollarSign,
  ShoppingBag,
  Target,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import PageHeader from "../../components/ui/PageHeader";
import ReportKpiCard from "../../components/reports/ReportKpiCard";
import ReportChartCard from "../../components/reports/ReportChartCard";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportTabs from "../../components/reports/ReportTabs";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatLabel,
  reportChartColors,
} from "../../components/reports/reportFormatters";
import { appRoutes } from "../../config/routes";
import {
  getCrmOverview,
  getLeadAnalytics,
  getCustomerAnalytics,
  getRevenueAnalytics,
  getSalesAnalytics,
} from "../../services/reports.service";

const initialFilters = {
  from: "",
  to: "",
  customerType: "",
  leadSource: "",
};

const CRMReportsPage = () => {
  const [filters, setFilters] =
    useState(initialFilters);
  const [loading, setLoading] =
    useState(true);
  const [overview, setOverview] =
    useState(null);
  const [leadAnalytics, setLeadAnalytics] =
    useState(null);
  const [
    customerAnalytics,
    setCustomerAnalytics,
  ] = useState(null);
  const [
    revenueAnalytics,
    setRevenueAnalytics,
  ] = useState(null);
  const [salesAnalytics, setSalesAnalytics] =
    useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadReports =
      async () => {
        try {
          setLoading(true);

          const [
            overviewResponse,
            leadResponse,
            customerResponse,
            revenueResponse,
            salesResponse,
          ] = await Promise.all([
            getCrmOverview(filters),
            getLeadAnalytics(filters),
            getCustomerAnalytics(filters),
            getRevenueAnalytics(filters),
            getSalesAnalytics(filters),
          ]);

          if (!isMounted) {
            return;
          }

          setOverview(
            overviewResponse.data
          );
          setLeadAnalytics(
            leadResponse.data
          );
          setCustomerAnalytics(
            customerResponse.data
          );
          setRevenueAnalytics(
            revenueResponse.data
          );
          setSalesAnalytics(
            salesResponse.data
          );
        } catch (error) {
          if (isMounted) {
            toast.error(
              error?.response?.data
                ?.message ||
                "Failed to load CRM reports"
            );
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    loadReports();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (
    key,
    value
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const quickLinks = [
    {
      title: "Lead Analytics",
      description:
        "Track source mix, monthly lead creation, and stage movement.",
      to: appRoutes.crmReportsLeads,
      icon: Target,
    },
    {
      title:
        "Customer Analytics",
      description:
        "Review growth, segmentation, and top customer contribution.",
      to: appRoutes.crmReportsCustomers,
      icon: Users,
    },
    {
      title:
        "Revenue Analytics",
      description:
        "Compare expected pipeline value against closed revenue.",
      to: appRoutes.crmReportsRevenue,
      icon:
        CircleDollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporting & Dashboard"
      />

      <ReportTabs />

      <ReportFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() =>
          setFilters(initialFilters)
        }
        showCustomerType
        showLeadSource
      />

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Loading CRM reports...
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportKpiCard
              title="Total Customers"
              value={formatNumber(
                overview?.totalCustomers
              )}
              subtitle="Customer records in selected range"
              icon={Users}
              tone="blue"
            />
            <ReportKpiCard
              title="Total Leads"
              value={formatNumber(
                overview?.totalLeads
              )}
              subtitle="Opportunities currently tracked"
              icon={BriefcaseBusiness}
              tone="teal"
            />
            <ReportKpiCard
              title="Conversion Rate"
              value={formatPercentage(
                overview?.conversionRate
              )}
              subtitle={`${formatNumber(
                overview?.wonLeads
              )} won vs ${formatNumber(
                overview?.totalLeads
              )} total`}
              icon={TrendingUp}
              tone="emerald"
            />
            <ReportKpiCard
              title="Revenue Generated"
              value={formatCurrency(
                overview?.revenueGenerated
              )}
              subtitle="Closed sales in selected period"
              icon={BadgeDollarSign}
              tone="violet"
            />
            <ReportKpiCard
              title="New Leads"
              value={formatNumber(
                overview?.newLeads
              )}
              subtitle="Fresh opportunities to nurture"
              icon={Activity}
              tone="amber"
            />
            <ReportKpiCard
              title="Won Leads"
              value={formatNumber(
                overview?.wonLeads
              )}
              subtitle="Converted and closed"
              icon={Target}
              tone="emerald"
            />
            <ReportKpiCard
              title="Lost Leads"
              value={formatNumber(
                overview?.lostLeads
              )}
              subtitle="Opportunities not converted"
              icon={XCircle}
              tone="rose"
            />
            <ReportKpiCard
              title="Expected Revenue"
              value={formatCurrency(
                overview?.expectedRevenue
              )}
              subtitle="Open pipeline value"
              icon={ChartSpline}
              tone="blue"
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary-ink)]">
                      <Icon size={20} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <ReportChartCard
              title="Monthly Sales Trend"
              description="Closed sales performance by month"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      salesAnalytics?.monthlySalesTrend ||
                      []
                    }
                  >
                    <defs>
                      <linearGradient
                        id="salesTrendFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
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
                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#2563eb"
                      fill="url(#salesTrendFill)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ReportChartCard>

            <ReportChartCard
              title="Lead Conversion Funnel"
              description="Volume progression from new lead to closed win"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      leadAnalytics?.leadConversionFunnel ||
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
                      dataKey="stage"
                      type="category"
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
                        leadAnalytics?.leadConversionFunnel ||
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

            <ReportChartCard
              title="Customers by Type"
              description="Current customer mix across CRM segments"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        customerAnalytics?.customersByType ||
                        []
                      }
                      dataKey="count"
                      nameKey="type"
                      innerRadius={75}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {(
                        customerAnalytics?.customersByType ||
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
              title="Revenue by Customer Type"
              description="Closed revenue contribution by segment"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      revenueAnalytics?.revenueByCustomerType ||
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
                        revenueAnalytics?.revenueByCustomerType ||
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
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportKpiCard
              title="Total Sales"
              value={formatCurrency(
                salesAnalytics?.totalSales
              )}
              subtitle="Gross sales volume"
              icon={ShoppingBag}
              tone="blue"
            />
            <ReportKpiCard
              title="Total Orders"
              value={formatNumber(
                salesAnalytics?.totalOrders
              )}
              subtitle="Completed sale count"
              icon={ShoppingBag}
              tone="teal"
            />
            <ReportKpiCard
              title="Average Order Value"
              value={formatCurrency(
                salesAnalytics?.averageOrderValue
              )}
              subtitle="Revenue per order"
              icon={CircleDollarSign}
              tone="amber"
            />
            <ReportKpiCard
              title="Active Customers"
              value={formatNumber(
                customerAnalytics?.summary
                  ?.totalActiveCustomers
              )}
              subtitle="Currently active CRM accounts"
              icon={Users}
              tone="emerald"
            />
          </section>
        </>
      )}
    </div>
  );
};

export default CRMReportsPage;
