import mongoose from 'mongoose';
import { GetProfileDTO } from '../../modules/users/users.interface';

export interface PaginationDTO {
  page: number;
  limit: number;
  sort?: any;
  shouldBePaginated?: boolean;
}

export interface GetBusinessUsersDTO extends PaginationDTO {
  businessId: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  email?: string;
  roleId?: 'all';
  // shouldBePaginated:boolean
}

export interface GetAllBusinessesDTO extends PaginationDTO {
  category_slug?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  name?: string;
}

export interface businessProfileDTO extends GetProfileDTO {}

export interface InviteNewBusinessAdminDTO {
  companyEmail: string;
  adminEmail: string;
  firstName: string;
  lastName: string;
  companyName: string;
  type: string;
}

export interface CreateBusinessDTO {
  businessId: string;
  displayName?: string;
  doesBusinessConsent?: string;
  legalName?: string;
  registrationnumber?: string;
  logo?: string;
  companyEntityType?: string;
  tagline?: string;
  industry?: string;
  supportPhone: string;
  supportEmail?: string;
  website?: string;
  addressDetails: {
    street?: string;
    zipCode?: string;
    subStreet?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  yearFounded?: string;
  overview?: string;
  termOfuseUrl?: string;
  privacyPolicyUrl?: string;
  serviceAgreementUrl?: string;
  faqUrl?: string;
}

export interface updateTakeLookAroundStatusDTO {
  businessId: string;
}
export interface AddFrameworkToBusinessDTO {
  businessId: string;
  frameworkId: string;
  user: {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
  };
}

export interface BusinessID extends PaginationDTO {
  businessId: string;
}

export enum BusinessReqStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Completed = 'completed',
}
export interface GetBusinessRequirementDTO {
  businessId: string;
  status?: BusinessReqStatus;
  processOwner?: string;
  clause?: string;
}
export interface AddRequirementToBusinessDTO {
  businessId: string;
  requirementId: string;
  processOwner: mongoose.Types.ObjectId;
}

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

export interface AddEvidenceDTO {
  files: [fileType];
  evidenceTitle: string;
  user: {
    _id: mongoose.Types.ObjectId;
  };
  businessId: string;
  requirementId: string;
}

export interface RequirementIdDTO {
  requirementId: string;
}
