import mongoose from '../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import TimeStampFormat from '../../utils/timestampFormat';

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

export interface IRole extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  description: string;
  name: string;
  // slug: string;
  // isCustom: string;
  permissions: string[];
  businessId?: mongoose.Types.ObjectId;
  type: string;
}
const roleSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    // },
    // isCustom: {
    //   type: Boolean,
    //   default: true,
    // },
    permissions: [
      {
        type: String,
      },
    ],
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    toObject: {
      virtuals: true,
      retainKeyOrder: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

roleSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};

roleSchema.index(
  {
    businessId: 1,
    createdAt: -1,
  },
  {
    background: true,
  },
);

roleSchema.index(
  {
    createdAt: -1,
  },
  {
    background: true,
  },
);

// Load business rules to models
roleSchema.loadClass(TimeStampFormat);
// add pagination plugin
roleSchema.plugin(mongoosePaginate);
const Role = mongoose.model<IRole>('Role', roleSchema);
export default Role;
