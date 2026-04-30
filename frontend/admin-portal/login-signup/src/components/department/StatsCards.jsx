const StatsCards = ({ complaints }) => {
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card title="Total" value={total} />
      <Card title="Pending" value={pending} />
      <Card title="Resolved" value={resolved} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow p-4 rounded-xl text-center">
    <h2 className="text-lg">{title}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default StatsCards;