import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = {
  limit: 20,
  useEstimatedCount: false,
  allowDiskUse: true,
  customLabels: {
    totalDocs: 'totalDocs',
    docs: 'docs',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'totalPages',
    pagingCounter: 'serialNo',
    meta: 'pagination',
  },
};

export interface IDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  frameworkIds: mongoose.Types.ObjectId[];
  requirementIds: mongoose.Types.ObjectId[];
  documentName: string;
  documentType?: string;
  classification: string;
  version: string;
  reviewCycle: string;
  approver: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  content: string;
  status?: string;
  owner: mongoose.Types.ObjectId;
  nextReview: Date;
}

const DocumentSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    frameworkIds: {
      type: [mongoose.Types.ObjectId],
      ref: 'Framework',
    },
    requirementIds: {
      type: [mongoose.Types.ObjectId],
      ref: 'Framework-Requirement',
    },
    documentName: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      default: null,
    },
    classification: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    reviewCycle: {
      type: String,
      required: true,
    },
    nextReview: {
      type: Date,
    },
    approver: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    reviewer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'draft',
    },
  },
  { timestamps: true },
);

const Documents = mongoose.model<IDocument>('Document', DocumentSchema);

export default Documents;
