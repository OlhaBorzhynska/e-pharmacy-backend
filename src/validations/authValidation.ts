import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().trim().email().required(),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .required(),

  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    )
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),

  password: Joi.string().required(),
});
