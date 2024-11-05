import Joi from "joi";

export const productDto = Joi.object({
  title: Joi.string().min(5).max(15).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().required(),
  thumbnail: Joi.string().optional(),
  code: Joi.string().required(),
  stock: Joi.number().max(200).required(),
  category: Joi.string().required(),
});

export const updateProductDto = Joi.object({
  title: Joi.string().min(5).max(15).optional(),
  description: Joi.string().min(10).max(500).optional(),
  price: Joi.number().optional(),
  thumbnail: Joi.string().optional(),
  code: Joi.string().optional(),
  stock: Joi.number().max(200).optional(),
  category: Joi.string().optional(),
});
