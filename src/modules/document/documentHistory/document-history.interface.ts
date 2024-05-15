import mongoose from 'mongoose';

export interface createDocumentHistoryDTO {
  businessId: mongoose.Types.ObjectId;
  content?: string;
  modifiedBy: mongoose.Types.ObjectId;
}
