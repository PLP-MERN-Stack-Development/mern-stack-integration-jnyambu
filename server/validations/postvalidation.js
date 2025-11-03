// server/validations/postValidation.js

const Joi = require("joi");

// Validation for creating/updating a blog post
const postValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(10).required(),
    category: Joi.string().optional(),
    author: Joi.string().optional(),
    image: Joi.string().optional(),
  });

  return schema.validate(data);
};

module.exports = postValidation;
