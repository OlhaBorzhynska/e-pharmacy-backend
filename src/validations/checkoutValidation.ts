import Joi from "joi";

export const checkoutSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().trim().email().required(),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .required(),

  address: Joi.string().trim().min(5).max(200).required(),

  paymentMethod: Joi.string().valid("Cash On Delivery", "Bank").required(),
});
