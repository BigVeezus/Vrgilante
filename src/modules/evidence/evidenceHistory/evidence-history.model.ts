import mongoose from '../../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import TimeStampFormat from '../../../utils/timestampFormat';
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

export interface IEvidenceHistory extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  evidenceId: mongoose.Types.ObjectId;
  description: string;
  modifiedBy: mongoose.Types.ObjectId;
}

const EvidenceHistorySchema = new mongoose.Schema(
  {
    evidenceId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business-Evidence',
    },
    description: {
      type: String,
      default: null,
    },
    modifiedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
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

EvidenceHistorySchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Load business rules to models
EvidenceHistorySchema.loadClass(TimeStampFormat);
// add pagination plugin
EvidenceHistorySchema.plugin(mongoosePaginate);
const EvidenceHistory = mongoose.model<IEvidenceHistory>('Evidence-History', EvidenceHistorySchema);

export default EvidenceHistory;
