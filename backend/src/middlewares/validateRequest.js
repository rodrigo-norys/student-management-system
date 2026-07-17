// @ts-check
/**
 * @param {import('yup').Schema} schema
 * @returns {import('express').RequestHandler}
 */
export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (e) {
    return res.status(400).json({ errors: e.errors });
  }
};
