import mongoose from '../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import TimeStampFormat from '../../utils/timestampFormat';
import { Mongoose, Schema } from 'mongoose';
import { any } from 'joi';

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

export interface IEvidence extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  frameworkId: mongoose.Types.ObjectId;
  requirementId: mongoose.Types.ObjectId;
  evidenceTitle: string;
  content: string;
}

const EvidenceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    frameworkId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
    },
    requirementId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
    },
    evidenceTitle: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'lastModifiedAt',
    },
    toObject: {
      virtuals: true,
      retainKeyOrder: true,
    },
    toJSON: {
      virtuals: true,
    },
    minimize: false,
  },
);

EvidenceSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load business rules to models
EvidenceSchema.loadClass(TimeStampFormat);
// add pagination plugin
EvidenceSchema.plugin(mongoosePaginate);
const Evidence = mongoose.model<IEvidence>('Business-Evidence', EvidenceSchema);

export default Evidence;
