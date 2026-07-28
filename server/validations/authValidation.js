import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 2 characters.",
            "string.max": "Name cannot exceed 50 characters."
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email."
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password cannot exceed 30 characters."
        })
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email."
        }),
    
    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password cannot exceed 30 characters."
        })
}); 

export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "any.required": "Email is required.",
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email."
        })
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string()
        .trim()
        .min(8)
        .max(30)
        .required()
        .messages({
            "any.required": "Password is required.",
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password cannot exceed 30 characters."
        }),

    confirmPassword: Joi.string()
        .trim()
        .required()
        .valid(Joi.ref("password"))
        .messages({
            "any.required": "Confirm password is required.",
            "string.empty": "Confirm password is required.",
            "any.only": "Password and confirm password do not match."
        })
});

export const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .trim()
        .min(8)
        .max(30)
        .required()
        .messages({
            "any.required": "Current password is required.",
            "string.empty": "Current password is required.",
            "string.min": "Current password must be at least 8 characters.",
            "string.max": "Current password cannot exceed 30 characters."
        }),

    newPassword: Joi.string()
        .trim()
        .min(8)
        .max(30)
        .required()
        .invalid(Joi.ref("currentPassword"))
        .messages({
            "any.required": "New password is required.",
            "string.empty": "New password is required.",
            "string.min": "New password must be at least 8 characters.",
            "string.max": "New password cannot exceed 30 characters.",
            "any.invalid": "New password cannot be same as current password."
        }),

    confirmPassword: Joi.string()
        .trim()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.required": "Confirm password is required.",
            "string.empty": "Confirm password is required.",
            "any.only": "New password and confirm password do not match."
        })
});

export const updateProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 2 characters.",
            "string.max": "Name cannot exceed 50 characters."
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email."
        }),
});