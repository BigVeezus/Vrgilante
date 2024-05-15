import Joi from 'joi';
import { DocumentStatus, REVIEWCYCLE } from './document.interface';

const fileSchema = Joi.object({
  fieldname: Joi.string().optional(),
  originalname: Joi.string().optional(),
  encoding: Joi.string().optional(),
  mimetype: Joi.string().optional(),
  destination: Joi.string().optional(),
  filename: Joi.string().optional(),
  path: Joi.string().optional(),
  size: Joi.number().optional(),
});

export const createDocumentValidator = Joi.object().keys({
  files: Joi.array().items(fileSchema).optional(),
  documentName: Joi.string().trim().required(),
  documentType: Joi.string().trim().optional().allow(''),
  businessId: Joi.string().trim().required(),
  frameworkIds: Joi.array().items(Joi.string()).required(),
  requirementIds: Joi.array().items(Joi.string()).required(),
  user: Joi.object().required(),
  classification: Joi.string().trim().required(),
  version: Joi.string().trim().required(),
  reviewCycle: Joi.string().trim().valid('yearly', 'quarterly').required(),
  approver: Joi.string().trim().required(),
  reviewer: Joi.string().trim().required(),
  content: Joi.string().trim().optional().allow('f'),
});

export const updateDocumemtStatusValidator = Joi.object().keys({
  user: Joi.object().required(),
  businessId: Joi.string().trim().required(),
  documentId: Joi.string().trim().required(),
  status: Joi.string().trim().valid(DocumentStatus.APPROVED, DocumentStatus.PUBLISHED, DocumentStatus.REJECTED).required(),
});

export const getDocumentByRequirmentValidator = Joi.object().keys({
  limit: Joi.number().integer().min(1).default(20),
  page: Joi.number().integer().min(1),
  requirementId: Joi.string().required(),
  businessId: Joi.string().trim().required(),
});

export const getDocumentValidator = Joi.object().keys({
  documentId: Joi.string(),
});

export const getDocumentsValidator = Joi.object().keys({
  limit: Joi.number().integer().min(1).default(20),
  page: Joi.number().integer().min(1),
  businessId: Joi.string().trim().required(),
  framework: Joi.string().trim().optional(),
  owner: Joi.string().trim().optional(),
  version: Joi.string().trim().optional(),
  status: Joi.string().trim().optional(),
  shouldBePaginated: Joi.boolean().optional().default(true),
});
