import Joi from 'joi';

export const getEvidenceHistoryValidator = Joi.object().keys({
  evidenceId: Joi.string().trim().required(),
});
