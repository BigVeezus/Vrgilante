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

export interface IRequirementHeader extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  frameworkId: mongoose.Types.ObjectId;
  clause?: string;
  title?: string;
  controlObjective?: string;
  implementationGuidance?: string;
  suggestedEvidence: string;
}
const RequirementHeaderSchema = new mongoose.Schema(
  {
    frameworkId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
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

RequirementHeaderSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load framework rules to models
RequirementHeaderSchema.loadClass(TimeStampFormat);
// add pagination plugin
RequirementHeaderSchema.plugin(mongoosePaginate);
const RequirementHeader = mongoose.model<IRequirementHeader>('Requirement-Header', RequirementHeaderSchema);

export default RequirementHeader;
