import Joi from "joi";

export const cartDto = Joi.object({
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().positive().required(),
    })
  ),
});

export const cartQuantityDto = Joi.object({
  quantity: Joi.number().max(500).integer().positive().required(),
});
