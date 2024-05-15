import mongoose from '../../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import { companyEntityTypes } from '../business.constant';
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

export interface IBusinessRequirement extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  requirementId?: mongoose.Types.ObjectId;
  subRequirementId?: mongoose.Types.ObjectId;
  status: string;
}

const BusinessRequirementSchema = new mongoose.Schema(
  {
    requirementId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework-Requirement',
    },
    subRequirementId: {
      type: mongoose.Types.ObjectId,
      ref: 'Sub-Requirement',
    },
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'not-applicable'],
      default: 'not-started',
    },
    isApplicable: {
      type: Boolean,
      default: false,
    },
    processOwner: {
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

BusinessRequirementSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load business rules to models
BusinessRequirementSchema.loadClass(TimeStampFormat);
// add pagination plugin
BusinessRequirementSchema.plugin(mongoosePaginate);
const BusinessRequirement = mongoose.model<IBusinessRequirement>('BusinessRequirement', BusinessRequirementSchema);

export default BusinessRequirement;
