import FlintError from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmails.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { generateForgotPasswordEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";

export const register = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await database.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, avatar, created_at`,
        [name, email, hashedPassword]
    );
    
    sendToken(user.rows[0], 201, "User registered successfully", res);
    
})

export const login = catchAsyncError(async (req, res, next) => {
    const {email, password} = req.body;

    const user = await database.query(
        `SELECT id, name, email, role, password, avatar, created_at FROM users WHERE email = $1`,
        [email]
    );

    if (user.rows.length === 0) {
        return next(new FlintError("Invalid email or password", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordMatched) {
        return next(new FlintError("Invalid email or password", 401));
    }
    
    const { password: _, ...userWithoutPassword } = user.rows[0];
    sendToken(userWithoutPassword, 200, "User logged in successfully", res);
})

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true, 
        user
    });
})

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }).json({
        success: true,
        message: "Logged out successfully"
    });
})

export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const {email} = req.body;
    
    let userResult = await database.query(
        `SELECT id, name, email FROM users WHERE email = $1`,
        [email]
    );

    if (userResult.rows.length === 0) {
        return res.status(200).json({
            success: true,
            message: "If an account exists, a reset link has been sent."
        });
    }

    const user = userResult.rows[0];

    const { resetToken, hashedToken, tokenExpiration } = generateResetPasswordToken();

    await database.query(
        `UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3`,
        [hashedToken, new Date(tokenExpiration), email]
    )

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "Flint Ecommerce Password Reset Request",
            message
        });
        res.status(200).json({
            success: true, 
            message: `If an account exists, a reset link has been sent.`
        })
    } catch (error) {
        await database.query(
            `UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE email = $1`,
            [email]
        );
        return next(new FlintError("Failed to send email. Please try again later.", 500));
    }

})

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const token = req.params.token;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await database.query(
        `SELECT id, name, email, reset_password_token, reset_password_expires FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()`,
        [resetPasswordToken]
    );

    if (user.rows.length === 0){
        return next(new FlintError("Invalid or expired password reset token", 400));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updatedUser = await database.query(
        `UPDATE users
            SET password = $1,
            reset_password_token = NULL,
            reset_password_expires = NULL
        WHERE id = $2
        RETURNING id, name, email, role, created_at`,
        [hashedPassword, user.rows[0].id]
    );

    sendToken(updatedUser.rows[0], 200, "Password reset successfully", res);
})

export const updatePassword = catchAsyncError(async(req, res, next) => {
    const {currentPassword, newPassword} = req.body;

    const user = await database.query(
        `SELECT id, name, email, password, role, created_at FROM users WHERE id = $1`,
        [req.user.id]
    );

    if (user.rows.length === 0) return next(new FlintError("User not found", 404))

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.rows[0].password);

    if(!isPasswordMatched){
        return next(new FlintError("Current password is incorrect", 400));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await database.query(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashedNewPassword, req.user.id]
    );

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

export const updateProfile = catchAsyncError(async(req, res, next) => {
    const {name, email} = req.body;

    let avatarData = {};

    if(req.files && req.files.avatar){
        const {avatar} = req.files;
        if(req.user?.avatar?.public_id){
            await cloudinary.uploader.destroy(req.user.avatar.public_id);
        }

        const newProfilePicture = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: "flint-ecommerce/avatars",
            width: 150,
            crop: "scale",
        });

        avatarData = {
            public_id: newProfilePicture.public_id,
            url: newProfilePicture.secure_url
        };
    }

    let user;
    if(Object.keys(avatarData).length === 0){
        user = await database.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, avatar, role, created_at",
            [name, email, req.user.id]
        );
    }else{
        user = await database.query(
            "UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4 RETURNING id, name, email, avatar, role, created_at",
            [name, email, JSON.stringify(avatarData), req.user.id]
        )
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: user.rows[0]
    });

})