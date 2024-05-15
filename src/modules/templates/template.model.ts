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

export interface ITemplate extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  frameworkId: mongoose.Types.ObjectId;
  frameworkName: string;
  title: string;
  content: string;
}

const TemplateSchema = new mongoose.Schema(
  {
    frameworkId: {
      type: mongoose.Types.ObjectId,
      ref: 'Framework',
    },
    frameworkName: {
      type: String,
      default: null,
    },
    title: {
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

TemplateSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

// Load business rules to models
TemplateSchema.loadClass(TimeStampFormat);
// add pagination plugin
TemplateSchema.plugin(mongoosePaginate);
const Template = mongoose.model<ITemplate>('Template', TemplateSchema);

export default Template;
