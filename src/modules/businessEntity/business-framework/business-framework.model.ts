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

export interface IBusinessFramework extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  frameworkId: mongoose.Types.ObjectId;
  createdBy: {
    name?: string;
    adminId: mongoose.Types.ObjectId;
  };
}

const BusinessFrameworkSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    frameworkId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
    },
    createdBy: {
      name: {
        type: String,
        default: null,
      },
      adminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
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

BusinessFrameworkSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load business rules to models
BusinessFrameworkSchema.loadClass(TimeStampFormat);
// add pagination plugin
BusinessFrameworkSchema.plugin(mongoosePaginate);
const BusinessFramework = mongoose.model<IBusinessFramework>('Business-Framework', BusinessFrameworkSchema);

export default BusinessFramework;
