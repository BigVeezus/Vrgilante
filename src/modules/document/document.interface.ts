import { PaginationDTO } from '../../modules/businessEntity/business.interface';
import { IUser } from '../../modules/users/models/users.model';

export interface fileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
}

export interface DocumentDTO {
  files?: [fileType];
  documentName: string;
  businessId: string;
  frameworkIds: string[];
  requirementIds: string[];
  classification: string;
  version: string;
  reviewCycle: string;
  approver: string;
  reviewer: string;
  content?: string;
  user: IUser;
}

export enum DocumentStatus {
  APPROVED = 'approved',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
}

export interface DocumentStatusUpdateDTO {
  documentId: string;
  businessId: string;
  user: IUser;
  status: string;
}

export interface GetDocumentByRequirementID extends PaginationDTO {
  requirementId: string;
  businessId: string
}

export interface GetDocumentsDTO extends PaginationDTO {
  businessId: string;
  framework?: string;
  owner?: string;
  version?: string;
  status?: string;
}

export enum REVIEWCYCLE {
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
}

export interface GetDocumentByIdDTO {
  documentId: string;
}
