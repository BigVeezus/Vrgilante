import mongoose from 'mongoose';

export interface requirementHistory {
  requirementId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  content?: string;
  modifiedBy: mongoose.Types.ObjectId;
}
