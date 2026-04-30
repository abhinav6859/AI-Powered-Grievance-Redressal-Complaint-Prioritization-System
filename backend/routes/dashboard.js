import express from "express";
import Grievance from "../models/Grievance.js";
import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

/**
 * Shared Dashboard
 * - Admin → sees all complaints
 * - Dept Head → sees department complaints
 * - Dept Officer → sees department complaints
 */
router.get(
  "/dashboard",
  verifyToken,
  allowRoles("admin", "department_head", "department_officer"),
  async (req, res) => {
    try {
      let grievances;

      if (req.user.role === "admin") {
        // Admin sees ALL
        grievances = await Grievance.find();
      } else {
        // Dept users see ONLY their department
        grievances = await Grievance.find({
          department: req.user.department,
        });
      }

      res.json({ data: grievances });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }
);

export default router;