import Joi from 'joi';

export const createCommentValidation = Joi.object().keys({
  user: Joi.object().required(),
  businessId: Joi.string().required(),
  text: Joi.string().required(),
  taskId: Joi.string().optional(),
  entity: Joi.string().valid('document', 'requirement', 'audit', 'task'),
});

export const getCommentsValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  entity: Joi.string().valid('document', 'requirement', 'audit', 'task').required(),
});

export const updateCommentValidation = Joi.object().keys({
  user: Joi.object().required(),
  commentId: Joi.string().optional(),
  text: Joi.string().optional(),
});

export const removeCommentValidation = Joi.object().keys({
  user: Joi.object().required(),
  commentId: Joi.string().required(),
});

export const createReplyValidation = Joi.object().keys({
  user: Joi.object().required(),
  text: Joi.string().required(),
  commentId: Joi.string().required(),
});

export const getRepliesValidation = Joi.object().keys({
  commentId: Joi.string().required(),
});

export const likeValidation = Joi.object().keys({
  user: Joi.object().required(),
  commentId: Joi.string().required(),
});
