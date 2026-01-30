import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const API = import.meta.env.VITE_API_URL;

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "department_head", label: "Department Head" },
    { value: "department_officer", label: "Department Officer" },
  ];

  const departments = ["Health", "Education", "Transport"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admin/signup`, form);
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-100">
      
      {/* LEFT PANEL – GOVERNMENT BRANDING */}
      <div className="hidden lg:flex flex-col justify-center px-14 bg-[#000080] text-white">
        <h1 className="text-3xl font-bold leading-tight">
          AI-Based Grievance  
          <br /> Redressal System
        </h1>

        <p className="mt-4 text-gray-200 text-sm max-w-md">
          A Smart India Hackathon initiative to automate complaint
          prioritization and improve government service delivery using AI.
        </p>

        <div className="mt-10">
          <div className="flex gap-2 mb-3">
            <span className="h-1 w-12 bg-[#FF9933]" />
            <span className="h-1 w-12 bg-white" />
            <span className="h-1 w-12 bg-[#138808]" />
          </div>
          <p className="text-xs uppercase tracking-wide text-gray-300">
            Government of India | SIH Portal
          </p>
        </div>
      </div>

      {/* RIGHT PANEL – FORM */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl bg-white shadow-lg border border-gray-200">

          {/* Header */}
          <div className="border-b px-8 py-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Administrator Registration
            </h2>
            <p className="text-sm text-gray-500">
              Fill official details to create admin access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="px-8 py-6 space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  name="name"
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border focus:ring-1 focus:ring-blue-700 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border bg-white focus:ring-1 focus:ring-blue-700 outline-none"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(form.role === "department_head" ||
              form.role === "department_officer") && (
              <div>
                <label className="text-sm text-gray-600">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
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

            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border focus:ring-1 focus:ring-blue-700 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border focus:ring-1 focus:ring-blue-700 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#000080] text-white font-semibold hover:bg-[#000066] transition"
            >
              Register Administrator
            </button>

            {message && (
              <p
                className={`text-center text-sm ${
                  message.includes("successful")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="text-center text-sm text-gray-600">
              Already registered?{" "}
              <Link
                to="/admin/login"
                className="text-blue-700 font-medium hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
