import Joi from "joi";

export const placeOrderSchema = Joi.object({
  shippingInfo: Joi.object({
    full_name: Joi.string().trim().min(2).max(100).required().messages({
      "any.required": "Full name is required.",
      "string.empty": "Full name is required.",
    }),

    state: Joi.string().trim().min(2).max(100).required(),

    city: Joi.string().trim().min(2).max(100).required(),

    country: Joi.string().trim().min(2).max(100).required(),

    address: Joi.string().trim().min(5).max(500).required(),

    pincode: Joi.string()
      .trim()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.pattern.base": "Pincode must be 6 digits.",
      }),

    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone must be 10 digits.",
      }),
  }).required(),

  orderItems: Joi.array()
    .min(1)
    .required()
    .items(
      Joi.object({
        productId: Joi.string()
          .trim()
          .guid({
            version: ["uuidv4"],
          })
          .required()
          .messages({
            "string.guid": "Invalid product id.",
          }),

        quantity: Joi.number().integer().min(1).required().messages({
          "number.min": "Quantity must be at least 1.",
        }),
      }),
    ),
});
