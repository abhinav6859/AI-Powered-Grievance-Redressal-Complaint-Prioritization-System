import { PieChart, Pie, Cell, Tooltip } from "recharts";

const StatusChart = ({ complaints }) => {
  const data = [
    {
      name: "Pending",
      value: complaints.filter((c) => c.status === "pending").length,
    },
    {
      name: "Resolved",
      value: complaints.filter((c) => c.status === "resolved").length,
    },
  ];

  const COLORS = ["#facc15", "#22c55e"];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="mb-2 font-semibold">Complaint Status</h2>

      <PieChart width={300} height={250}>
        <Pie data={data} dataKey="value" outerRadius={80}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default StatusChart;