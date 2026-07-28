import express from "express";
import { config } from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);

createTables();

// Importing routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/v1/auth", authRoutes);

import productRoutes from "./routes/productRoutes.js";
app.use("/api/v1/product", productRoutes);

import adminRoutes from "./routes/adminRoutes.js";
app.use("/api/v1/admin", adminRoutes);

import orderRoutes from "./routes/orderRoutes.js"
app.use("/api/v1/orders", orderRoutes);

import paymentRoutes from "./routes/paymentRoutes.js";
app.use("/api/v1/payment", paymentRoutes);


app.use(errorMiddleware);

export default app;