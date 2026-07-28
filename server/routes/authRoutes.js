import express from "express";
import {register, login, logout, getUser, forgotPassword, resetPassword, updatePassword, updateProfile} from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, updatePasswordSchema, updateProfileSchema } from "../validations/authValidation.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", logout);

router.post("/password/forgot", validate(forgotPasswordSchema), forgotPassword);
router.put("/password/reset/:token", validate(resetPasswordSchema), resetPassword);

router.put("/password/update", isAuthenticated, validate(updatePasswordSchema), updatePassword);
router.put("/profile/update", isAuthenticated, validate(updateProfileSchema), updateProfile);

export default router;