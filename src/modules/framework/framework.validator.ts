import Joi from 'joi';

export const createFrameworkValidation = Joi.object().keys({
  title: Joi.string().trim().required(),
  shortName: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  description: Joi.string().trim().optional().default(null),
  complianceStandard: Joi.object()
    .keys({
      name: Joi.string().trim().required(),
      description: Joi.string().trim().optional().default(null),
    })
    .required(),
  implementationGuidance: Joi.object()
    .keys({
      name: Joi.string().trim().required(),
      description: Joi.string().trim().optional().default(null),
      documentUrl: Joi.string().trim().required(),
    })
    .required(),
  referenceLinks: Joi.array().items(Joi.string()),
  departmentName: Joi.string().trim().required(),
  departmentDescription: Joi.string().trim().optional().default(null),
});

export const GetOneBusinessFrameworkParam = Joi.object().keys({
  businessId: Joi.string().trim().required(),
  id: Joi.string().trim().required(),
  status: Joi.string().valid('not-started', 'in-progress', 'completed').trim().optional(),
});

export const getMultipleFrameworksRequirement = Joi.object().keys({
  frameworks: Joi.array().items(Joi.string()).required(),
});
