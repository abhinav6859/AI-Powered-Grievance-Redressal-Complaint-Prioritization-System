import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

function Login({ setAuthenticated }) {
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "department_head", label: "Department Head" },
    { value: "department_officer", label: "Department Officer" },
  ];

  const departments = ["Health", "Education", "Transport"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/api/admin/login`, {
        email,
        password,
        role,
        department,
      });

      if (response.status === 200) {
        setAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        alert(response.data.message || "Login Successful");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f7] flex flex-col">
      
      {/* TOP GOVERNMENT BAR */}
      <header className="bg-[#000080] text-white px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">
            AI-Based Grievance Redressal System
          </h1>
          <p className="text-xs text-gray-200">
            Government of India | Smart India Hackathon
          </p>
        </div>

        <div className="flex gap-2">
          <span className="h-1 w-10 bg-[#FF9933]" />
          <span className="h-1 w-10 bg-white" />
          <span className="h-1 w-10 bg-[#138808]" />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-3xl bg-white border border-gray-200 shadow-md grid grid-cols-1 md:grid-cols-2">

          {/* LEFT INFO PANEL */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-gray-50 border-r">
            <h2 className="text-xl font-semibold text-gray-800">
              Authorized Access
            </h2>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              This portal is restricted to authorized administrators and
              departmental officials only. All login activities are monitored
              and recorded for security purposes.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li>✔ Secure role-based access</li>
              <li>✔ Department-wise control</li>
              <li>✔ Government audit compliance</li>
            </ul>
          </div>

          {/* RIGHT LOGIN FORM */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Administrator Login
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Enter your official credentials
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Role */}
              <div>
                <label className="text-sm text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border bg-white focus:ring-1 focus:ring-blue-700 outline-none"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              {(role === "department_head" ||
                role === "department_officer") && (
                <div>
                  <label className="text-sm text-gray-700">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-2 border bg-white focus:ring-1 focus:ring-blue-700 outline-none"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border focus:ring-1 focus:ring-blue-700 outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border focus:ring-1 focus:ring-blue-700 outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#000080] text-white font-semibold hover:bg-[#000066] transition"
              >
                Login to Dashboard
              </button>

              {/* Footer Links */}
              <div className="text-sm text-gray-600 flex justify-between">
                <span className="hover:underline cursor-pointer">
                  Forgot Password?
                </span>
                <span className="text-gray-500">
                  Need help? Contact IT Support
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
