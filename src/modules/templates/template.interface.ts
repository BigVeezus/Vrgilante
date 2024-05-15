import mongoose from 'mongoose';

interface fileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
}

export interface CreateTemplateBodyDTO {
  files: [fileType];
  frameworkId: mongoose.Types.ObjectId;
  title: string;
}

export interface CreateTemplatePayload {
  files: [fileType];
  frameworkId: mongoose.Types.ObjectId;
  title: string;
}

export interface GetAllTemplatesDTO {
  frameworkTitle?: string;
  frameworkId?: string;
  limit?: number;
  page: number;
}

export interface GetOneTemplateDTO {
  templateId: mongoose.Types.ObjectId;
}

export interface EditTemplateDto {
  templateId: mongoose.Types.ObjectId;
  title?: string;
  content?: string;
}
