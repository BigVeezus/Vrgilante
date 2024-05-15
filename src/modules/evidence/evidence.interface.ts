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

export interface EvidenceDTO {
  files: [fileType];
  user: {
    _id: mongoose.Types.ObjectId;
  };
  businessId: string;
  evidenceTitle: string;
  frameworkId: string;
  requirementId: string;
}

export interface GetEvidenceHistoryDTO {
  evidenceId: string;
}
