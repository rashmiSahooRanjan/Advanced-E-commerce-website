import express from "express";
import { createProduct, createProductReview, deleteProduct, deleteReview, fetchAIFilteredProducts, fetchAllProducts, fetchSingleProduct, updateProduct } from "../controllers/productController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createProductReviewSchema, createProductSchema, updateProductSchema } from "../validations/productValidation.js";

const router = express.Router();

router.post(
  "/new",
  isAuthenticated,
  authorizeRoles("Seller", "Admin"),
  validate(createProductSchema),
  createProduct,
);

router.get("/all", fetchAllProducts);

router.put(
    "/:productId",
    isAuthenticated,
    authorizeRoles("Seller", "Admin"),
    validate(updateProductSchema),
    updateProduct
);

router.delete(
    "/:productId",
    isAuthenticated,
    authorizeRoles("Seller", "Admin"),
    deleteProduct
)

router.get("/:productId", fetchSingleProduct);

router.post(
  "/:productId/review",
  isAuthenticated,
  validate(createProductReviewSchema),
  createProductReview
);

router.delete(
  "/:productId/review",
  isAuthenticated,
  deleteReview
)

router.post(
  "/ai/recommendation",
  fetchAIFilteredProducts
)


export default router;