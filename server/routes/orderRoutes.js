import express from "express";
import { fetchAllOrders, fetchMyOrders, fetchSingleOrder, placeNewOrder, updateOrderStatus } from "../controllers/orderController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { placeOrderSchema } from "../validations/orderValidation.js";

const router = express.Router();


router.post("/new", isAuthenticated, validate(placeOrderSchema), placeNewOrder);
router.get("/me", isAuthenticated, fetchMyOrders);
router.get("/all", isAuthenticated, authorizeRoles("Admin"), fetchAllOrders);
router.patch("/:orderId/status", isAuthenticated, updateOrderStatus);
router.get("/:orderId", isAuthenticated, fetchSingleOrder);


export default router;