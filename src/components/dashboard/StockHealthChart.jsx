import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

const StockHealthChart = ({
  stockHealth,
}) => {
  const data = [
    {
      name: "Healthy",
      value:
        stockHealth?.healthyStock || 0,
    },
    {
      name: "Low Stock",
      value:
        stockHealth?.lowStock || 0,
    },
    {
      name: "Out Of Stock",
      value:
        stockHealth?.outOfStock || 0,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

      <h3 className="text-lg font-semibold mb-4">
        Stock Health
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default StockHealthChart;