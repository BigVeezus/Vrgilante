import { GetProfileDTO } from '../../modules/users/users.interface';

export interface CreateFrameworkDTO {
  title: string;
  shortName?: string;
  category?: string;
  description?: string;
  complianceStandard: {
    name?: string;
    description?: string;
  };
  referenceLinks: string[];
  departmentName: string;
  departmentDescription: string;
  isDefaultFramework: boolean;
  implementationGuidance: {
    name?: string;
    description?: string;
    documentUrl: string;
  };
}

export interface GetAllFrameworksDTO {
  search?: string;
  category?: string;
  version?: string;
  date?: string;
  page: number;
  limit: number;
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

export interface RequirementUploadDTO {
  files: [fileType];
  type: string;
  frameworkId: string;
}

export interface GetID {
  id: string;
}

export interface GetOneBusinessFrameworkID extends GetID {
  businessId: string;
  status?: string;
}

export interface cSVFormat {
  index: string;
  sub_index: string;
  title: string;
  sub_title: string;
  objective: string;
  guidance: string;
  suggested_evidence: string;
  document: string;
  numOfEvidenceRequired?: number;
}

export interface GetMultipleFrameworksRequirementDTO {
  frameworks: string[];
}
