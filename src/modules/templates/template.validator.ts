import Joi from 'joi';

export const createTemplateValidator = Joi.object().keys({
  frameworkId: Joi.string().trim().required(),
  files: Joi.array().required(),
  title: Joi.string().trim().required(),
});
