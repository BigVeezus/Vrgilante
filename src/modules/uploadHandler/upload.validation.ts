import Joi from 'joi';

const fileSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(),
  destination: Joi.string().required(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number().required(),
});

const documentTypeEnumValues = ['template', 'document', 'framework'];
const mediaTypeEnumValues = ['logo', 'document'];

export const DocumentUploadValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  files: Joi.array().items(fileSchema),
  type: Joi.string()
    .valid(...documentTypeEnumValues)
    .required(),
});

export const MediaUploadValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  files: Joi.array().items(fileSchema),
  type: Joi.string().valid(...mediaTypeEnumValues),
});
