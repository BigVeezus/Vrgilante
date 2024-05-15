import Joi from 'joi';

export const updateRequirementStatus = Joi.object().keys({
  status: Joi.string().valid('not-applicable', 'in-progress', 'complete').trim().required(),
  requirementId: Joi.string().optional(),
  subRequirementId: Joi.string().optional(),
});
