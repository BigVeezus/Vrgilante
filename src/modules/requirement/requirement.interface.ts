import mongoose from 'mongoose';

export interface requirements {
  frameworkId: mongoose.Types.ObjectId;
  requirementHeaderId: mongoose.Types.ObjectId;
  clause?: string;
  title?: string;
  controlObjective?: string;
  implementationGuidance?: string;
  suggestedEvidence?: string;
  numOfEvidenceRequired?: number;
  document?: string;
}

export interface subRequirements {
  frameworkId: mongoose.Types.ObjectId;
  requirementId: mongoose.Types.ObjectId;
  clause?: string;
  title?: string;
  controlObjective?: string;
  implementationGuidance?: string;
  suggestedEvidence?: string;
  numOfEvidenceRequired?: number;
  document?: string;
}

export interface CompleteRequirementStatus {
  businessId: mongoose.Types.ObjectId;
  requirementId?: mongoose.Types.ObjectId;
  subRequirementId?: mongoose.Types.ObjectId;
  status: string;
}

export interface requirementsHeader {
  frameworkId: mongoose.Types.ObjectId;
  clause?: string;
  title?: string;
}

export interface CreateRequirementHeaderDTO {
  data: [requirementsHeader];
}

export interface CreateRequirementDTO {
  data: [requirements];
}
