// DepartmentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";
import DepartmentGrievances from "../GrievancesDashboard";
import DepartmentAnnouncements from "../Announcements";

const API = import.meta.env.VITE_API_URL;

function DepartmentDashboard() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState(null);
  
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    critical: 0,
  });

  const [monthlyProgress, setMonthlyProgress] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get department info from logged-in user
  useEffect(() => {
    const fetchUserDepartment = async () => {
      try {
        // Option 1: From localStorage (if stored during login)
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setDepartment(user.department);
          setDepartmentId(user.departmentId);
        }
        
        // Option 2: Fetch from API with auth token
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDepartment(res.data.department);
          setDepartmentId(res.data.departmentId);
        }
      } catch (err) {
        console.error("Error fetching user department", err);
      }
    };
    
    fetchUserDepartment();
  }, []);

  useEffect(() => {
    if (!department) return;
    
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get(`${API}/api/department-dashboard/stats`, {
          params: { department }
        });
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    const fetchMonthly = async () => {
      try {
        const res = await axios.get(`${API}/api/department-dashboard/progress/monthly`, {
          params: { department }
        });
        setMonthlyProgress(res.data);
      } catch (err) {
        console.error("Error fetching monthly progress", err);
      }
    };

    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${API}/api/department-dashboard/alerts`, {
          params: { department }
        });
        setAlerts(res.data);
      } catch (err) {
        console.error("Error fetching alerts", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API}/api/department-dashboard/tasks`, {
          params: { department }
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };

    Promise.all([fetchStats(), fetchMonthly(), fetchAlerts(), fetchTasks()]).finally(() => {
      setLoading(false);
    });
  }, [department]);

  const statusData = [
    { name: "Resolved", value: stats.resolved },
    { name: "Pending", value: stats.pending },
    { name: "Critical", value: stats.critical },
  ];

  const COLORS = ["#10b981", "#fbbf24", "#ef4444"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f6f7fb] p-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-5">
            <Link to="/department/dashboard/grievances">
              <button className="px-4 my-4 ml-1 sm:my-5 py-2 sm:py-4 text-sm rounded-lg font-semibold text-white bg-black">
                Department Grievances
              </button>
            </Link>
            <Link to="/admin/dashboard/announcements">
              <button className="px-4 my-4 sm:my-5 py-2 sm:py-4 text-sm rounded-lg font-semibold text-white bg-black">
                Announcements
              </button>
            </Link>
          </div>

          <button
            className="px-4 my-4 sm:my-5 py-2 sm:py-4 text-sm rounded-lg font-semibold text-white bg-black mr-1"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Department Welcome Banner */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-xl shadow mb-6">
          <div className="text-xl font-bold">
            Welcome, {department} Department
          </div>
          <p className="text-sm mt-1">
            Managing grievances specific to {department} department
          </p>
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-lg">
                New Grievances:{" "}
                <span className="text-purple-400 font-bold">
                  {stats.pending - (stats.pending - alerts.length)}
                </span>
              </p>
              <p className="text-xs">+{alerts.filter(a => a.isNew).length} today</p>
            </div>
            <div>
              <p className="text-lg">
                Pending Actions:{" "}
                <span className="text-yellow-300 font-bold">{stats.pending}</span>
              </p>
              <p className="text-xs">{stats.critical} urgent</p>
            </div>
            <div>
              <p className="text-lg">
                Resolved:{" "}
                <span className="text-green-400 font-bold">{stats.resolved}</span>
              </p>
              <p className="text-xs">
                {stats.total > 0
                  ? `${Math.round((stats.resolved / stats.total) * 100)}% success`
                  : "0% success"}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.total}</h3>
            <p className="text-sm text-gray-600">Total Cases ({department})</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.resolved}</h3>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.pending}</h3>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg text-center shadow">
            <h3 className="text-xl font-bold">{stats.critical}</h3>
            <p className="text-sm text-gray-600">Critical</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="w-full p-6 bg-white shadow-md rounded-lg mt-6">
          <h3 className="font-semibold text-lg mb-4">
            Monthly Overview - {department} Department
          </h3>

          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="w-full md:w-2/3 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    monthlyProgress.length
                      ? monthlyProgress
                      : [{ name: "No data", total: 0, resolved: 0 }]
                  }
                  barSize={25}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Grievances" />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-1/3 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        <div className="mb-6 mt-6">
          <div className="bg-red-100 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-red-700 mb-4">
              Critical Alerts - {department}
            </h3>
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} className="mb-4 border-b border-red-200 pb-3 last:border-0">
                  <p className="font-bold">⚠️ {alert.title}</p>
                  <p className="text-sm">
                    {alert.message} - {alert.time}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No critical alerts for your department</p>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Assigned Tasks - {department}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border-l-4 rounded ${
                    task.priority === "high"
                      ? "bg-red-50 border-red-500"
                      : task.priority === "medium"
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-green-50 border-green-500"
                  }`}
                >
                  <h4 className="font-bold capitalize">{task.priority} Priority</h4>
                  <p>
                    {task.title} - {task.deadline}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No tasks assigned to {department} department
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Routes for department pages */}
      <Routes>
        <Route
          path="/department/dashboard/grievances"
          element={<DepartmentGrievances department={department} departmentId={departmentId} />}
        />
        <Route
          path="/department/dashboard/announcements"
          element={<DepartmentAnnouncements department={department} />}
        />
      </Routes>
    </>
  );
}

export default DepartmentDashboard;