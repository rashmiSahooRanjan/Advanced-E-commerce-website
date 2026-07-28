import express from "express";
import {isAuthenticated} from '../middlewares/authMiddleware.js'
import { createPaymentOrder } from "../controllers/paymentController.js";
import { verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", isAuthenticated, createPaymentOrder);
router.post("/verify", isAuthenticated, verifyPayment);

export default router;