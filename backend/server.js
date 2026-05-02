import express from "express";
import mongoose from "mongoose"; // ✅ FIXED
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import { verifyToken } from "./middleware/auth.js";

import grievanceRoutes from "./routes/grievance.js";
import adminAuthRoutes from "./routes/adminAUth.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";
import announcementRoutes from "./routes/announcements.js";
import authRoutes from "./routes/citizenAuth.js";
import dashboardRoutes from "./routes/departmentDashboard.js";

dotenv.config(); // ✅ load env
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/grievance", grievanceRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/department-dashboard", dashboardRoutes);


app.get("/api/debug/user-info", verifyToken, async (req, res) => {
  try {
    const Grievance = mongoose.model("Grievance");
    const userDepartment = req.user.department;
    const complaintsInDept = await Grievance.countDocuments({ department: userDepartment });
    
    res.json({
      user: {
        id: req.user.id,
        role: req.user.role,
        department: userDepartment
      },
      complaintsInYourDepartment: complaintsInDept,
      allDepartments: await Grievance.distinct("department")
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );