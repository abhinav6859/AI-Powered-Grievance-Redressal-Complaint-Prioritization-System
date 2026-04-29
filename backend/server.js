import express from "express";
import mongoose from "mongoose"; // ✅ FIXED
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import grievanceRoutes from "./routes/grievance.js";
import adminAuthRoutes from "./routes/adminAUth.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";
import announcementRoutes from "./routes/announcements.js";
import authRoutes from "./routes/citizenAuth.js";

dotenv.config(); // ✅ load env

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



// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");

    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log(err));