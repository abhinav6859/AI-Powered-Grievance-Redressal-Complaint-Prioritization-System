import { useEffect, useState } from "react";
import axios from "axios";

import ComplaintTable from "./ComplaintTable";
import Filters from "./Filters";
import StatsCards from "./StatsCards";
import StatusChart from "./StatusChart";

const DepartmentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const token = localStorage.getItem("token");

  // 🔥 Fetch complaints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaints(res.data.data);
        setFiltered(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔍 Filtering logic
  useEffect(() => {
    let data = [...complaints];

    if (statusFilter !== "all") {
      data = data.filter((c) => c.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      data = data.filter((c) => c.priority === priorityFilter);
    }

    setFiltered(data);
  }, [statusFilter, priorityFilter, complaints]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Department Dashboard</h1>

      <StatsCards complaints={filtered} />

      <Filters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <StatusChart complaints={filtered} />

      <ComplaintTable complaints={filtered} />
    </div>
  );
};

export default DepartmentDashboard;