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

export interface ISubRequirement extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  frameworkId: mongoose.Types.ObjectId;
  requirementId: mongoose.Types.ObjectId;
  clause?: string;
  title?: string;
  sub_title?: string;
  controlObjective?: string;
  implementationGuidance?: string;
  suggestedEvidence?: string;
  numOfEvidenceRequired: number;
  document: string;
}
const SubRequirementSchema = new mongoose.Schema(
  {
    frameworkId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
    },
    requirementId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework-Requirement',
    },
    clause: {
      type: String,
      // required: true,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    sub_title: {
      type: String,
      default: null,
    },
    controlObjective: {
      type: String,
      default: null,
    },
    implementationGuidance: {
      type: String,
      default: null,
    },
    suggestedEvidence: {
      type: String,
      default: null,
    },
    numOfEvidenceRequired: {
      type: Number,
      default: 0,
    },
    document: {
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

SubRequirementSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load framework rules to models
SubRequirementSchema.loadClass(TimeStampFormat);
// add pagination plugin
SubRequirementSchema.plugin(mongoosePaginate);
const SubRequirement = mongoose.model<ISubRequirement>('Sub-Requirement', SubRequirementSchema);

export default SubRequirement;
