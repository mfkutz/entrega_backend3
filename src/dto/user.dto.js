import Joi from "joi";

const passwordSchema = Joi.string()
  .min(8)
  .max(30)
  .required()
  .messages({
    "string.min": "La contraseña debe tener al menos 8 caracteres.",
    "string.max": "La contraseña no puede tener más de 30 caracteres.",
    "any.required": "La contraseña es obligatoria.",
  })
  .custom((value, helpers) => {
    if (!/[A-Z]/.test(value)) {
      return helpers.message("La contraseña debe incluir al menos una letra mayúscula.");
    }
    if (!/[a-z]/.test(value)) {
      return helpers.message("La contraseña debe incluir al menos una letra minúscula.");
    }
    if (!/\d/.test(value)) {
      return helpers.message("La contraseña debe incluir al menos un número.");
    }
    if (!/[^\w]/.test(value)) {
      return helpers.message("La contraseña debe incluir al menos un carácter especial.");
    }
    return value; // Devuelve el valor si pasa todas las validaciones
  });

export const userDto = Joi.object({
  // trim() limina espacios en blanco al inicio y al final pero no los modifica al guardar en la base de datos
  first_name: Joi.string().trim().min(2).max(30).empty("").required().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres.",
    "string.max": "El nombre no puede tener más de 30 caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  last_name: Joi.string().trim().min(2).max(30).empty("").required().messages({
    "string.min": "El apellido debe tener al menos 2 caracteres.",
    "string.max": "El apellido no puede tener más de 30 caracteres.",
    "any.required": "El apellido es obligatorio.",
  }),
  email: Joi.string().trim().email().empty("").required().messages({
    "any.required": "El email es obligatorio.",
    "string.email": "El email no es válido.",
  }),
  age: Joi.number().positive().integer().max(100).empty("").required().messages({
    "number.base": "La edad debe ser un numero positivo y entero.",
    "number.positive": "La edad debe ser positiva.",
    "number.max": "La edad no puede ser mayor a 100.",
    "any.required": "La edad es obligatoria.",
  }),
  //PASSWORD CONTROL///////////////////////////////////////////
  //   password: Joi.string().min(4).max(15).required(),

  /* password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,30}$"))
    .messages({
      "string.pattern.base":
        "La contraseña debe tener entre 8 y 30 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial.",
      "any.required": "La contraseña es obligatoria.",
    }), */
  /*  repeat_password: Joi.string()
    .valid(Joi.ref("password")) // Referencia a 'password' para validar que son iguales
    .messages({
      "any.only": "Las contraseñas deben coincidir.", // Mensaje personalizado
      "any.required": "Debes repetir la contraseña.", // Mensaje si no se proporciona
    }), */

  password: passwordSchema,
  /////////////////////////////////////////////////////////////

  role: Joi.string().optional(),
});
