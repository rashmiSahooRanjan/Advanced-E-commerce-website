import Joi from "joi";

export const createProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(120)
        .required()
        .messages({
            "any.required": "Product name is required.",
            "string.empty": "Product name is required.",
            "string.min": "Product name must be at least 3 characters.",
            "string.max": "Product name cannot exceed 120 characters."
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .required()
        .messages({
            "any.required": "Description is required.",
            "string.empty": "Description is required.",
            "string.min": "Description must be at least 10 characters.",
            "string.max": "Description cannot exceed 2000 characters."
        }),

    price: Joi.number()
        .precision(2)
        .positive()
        .required()
        .messages({
            "any.required": "Price is required.",
            "number.base": "Price must be a number.",
            "number.positive": "Price must be greater than 0."
        }),

    category: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "Category is required.",
            "string.empty": "Category is required.",
            "string.min": "Category must be at least 2 characters.",
            "string.max": "Category cannot exceed 50 characters."
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "any.required": "Stock is required.",
            "number.base": "Stock must be a number.",
            "number.integer": "Stock must be an integer.",
            "number.min": "Stock cannot be negative."
        })
});

export const updateProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(120)
        .messages({
            "string.empty": "Product name is required.",
            "string.min": "Product name must be at least 3 characters.",
            "string.max": "Product name cannot exceed 120 characters."
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .messages({
            "string.empty": "Description is required.",
            "string.min": "Description must be at least 10 characters.",
            "string.max": "Description cannot exceed 2000 characters."
        }),

    price: Joi.number()
        .precision(2)
        .positive()
        .messages({
            "number.base": "Price must be a number.",
            "number.positive": "Price must be greater than 0."
        }),

    category: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .messages({
            "string.empty": "Category is required.",
            "string.min": "Category must be at least 2 characters.",
            "string.max": "Category cannot exceed 50 characters."
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "Stock must be a number.",
            "number.integer": "Stock must be an integer.",
            "number.min": "Stock cannot be negative."
        })
});

export const createProductReviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            "any.required": "Rating is required.",
            "number.base": "Rating must be a number.",
            "number.integer": "Rating must be an integer.",
            "number.min": "Rating must be at least 1.",
            "number.max": "Rating cannot exceed 5."
        }),

    comment: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .required()
        .messages({
            "any.required": "Comment is required.",
            "string.empty": "Comment is required.",
            "string.min": "Comment must be at least 10 characters.",
            "string.max": "Comment cannot exceed 2000 characters."
        })
});