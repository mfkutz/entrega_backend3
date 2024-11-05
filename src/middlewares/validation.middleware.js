export function validate(schema) {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  };
}
// Transforms the request body to the format expected by the model
export function transformContact(req, res, next) {
  if (req.body.firstName && req.body.lastName) {
    req.body.name = `${req.body.firstName} ${req.body.lastName}`;
    delete req.body.firstName;
    delete req.body.lastName;
  }
  next();
}
