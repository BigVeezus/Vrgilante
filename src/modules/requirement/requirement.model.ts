import mongoose from '../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import TimeStampFormat from '../../utils/timestampFormat';
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

export interface IRequirement extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  frameworkId: mongoose.Types.ObjectId;
  requirementHeaderId: mongoose.Types.ObjectId;
  clause?: string;
  title?: string;
  sub_title?: string;
  controlObjective?: string;
  implementationGuidance?: string;
  suggestedEvidence?: string;
  numOfEvidenceRequired: number;
  document: string;
}
const RequirementSchema = new mongoose.Schema(
  {
    frameworkId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
    },
    requirementHeaderId: {
      type: mongoose.Types.ObjectId,
      ref: 'Requirement-Header',
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

RequirementSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load framework rules to models
RequirementSchema.loadClass(TimeStampFormat);
// add pagination plugin
RequirementSchema.plugin(mongoosePaginate);
const Requirement = mongoose.model<IRequirement>('Framework-Requirement', RequirementSchema);

export default Requirement;
