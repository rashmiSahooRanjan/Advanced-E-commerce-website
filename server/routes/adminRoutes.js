import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { getAllUsers, deleteUser, fetchDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/customer/all", isAuthenticated, authorizeRoles("Admin"), getAllUsers);
router.delete("/customer/:id", isAuthenticated, authorizeRoles("Admin"), deleteUser);
router.get("/dashboard/stats", isAuthenticated, authorizeRoles("Admin"), fetchDashboardStats);


export default router;