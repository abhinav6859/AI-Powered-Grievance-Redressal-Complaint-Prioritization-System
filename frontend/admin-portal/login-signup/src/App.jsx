import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";
 import { Routes, Route, Link } from "react-router-dom";
  import Login from "./components/Login"; 
  import Signup from "./components/Signup";
   import './index.css';
    import Dashboard from "./components/Dashboard";
     import { useState } from "react";
      import GrievanceDashboard from "./components/GrievancesDashboard"; 
import Announcements from "./components/Announcements";
function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />

        <Route
          path="/admin/login"
          element={<Login setAuthenticated={setAuthenticated} />}
        />

        <Route path="/admin/signup" element={<Signup />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard/grievances"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GrievanceDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard/announcements"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Announcements />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;