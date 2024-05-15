import mongoose from '../../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import TimeStampFormat from '../../../utils/timestampFormat';
import { Mongoose } from 'mongoose';

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

export interface IRequirementHistory extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  requirementId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  content?: string;
  modifiedBy: mongoose.Types.ObjectId;
}
const RequirementHistorySchema = new mongoose.Schema(
  {
    requirementId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
    },
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    content: {
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

RequirementHistorySchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load framework rules to models
RequirementHistorySchema.loadClass(TimeStampFormat);
// add pagination plugin
RequirementHistorySchema.plugin(mongoosePaginate);
const RequirementHistory = mongoose.model<IRequirementHistory>('Requirement-History', RequirementHistorySchema);

export default RequirementHistory;
