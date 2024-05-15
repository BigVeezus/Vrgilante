import mongoose from '../../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import TimeStampFormat from '../../../utils/timestampFormat';

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

export interface IBusinessTeamMember extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  email: string;
  roleId: mongoose.Types.ObjectId;
}
const BusinessTeamMemberSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    email: {
      type: String,
      default: null,
    },
    roleId: {
      type: mongoose.Types.ObjectId,
      default: 'Role',
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

BusinessTeamMemberSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load business rules to models
BusinessTeamMemberSchema.loadClass(TimeStampFormat);
// add pagination plugin
BusinessTeamMemberSchema.plugin(mongoosePaginate);
const BusinessTeamMember = mongoose.model<IBusinessTeamMember>('Business-teamMember', BusinessTeamMemberSchema);

export default BusinessTeamMember;
