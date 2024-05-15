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

export interface IFramework extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  isDefaultFramework: boolean;
  title?: string;
  shortName?: string;
  category?: string;
  version?: string;
  description?: string;
  complianceStandard: {
    name?: string;
    description?: string;
  };
  referenceLinks?: string[];
  departmentResponsible: {
    name?: string;
    description?: string;
  };
  implementationGuidance: {
    name?: string;
    description?: string;
    documentUrl?: string;
  };
  slug: string;
}
const FrameworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
      default: null,
    },
    shortName: {
      type: String,
      // required: true,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    version: {
      type: String,
      default: '1.0',
    },
    description: {
      type: String,
      default: null,
    },
    isDefaultFramework: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      default: null,
    },
    complianceStandard: {
      name: {
        type: String,
        // required: true,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
    },
    referenceLinks: [
      {
        type: String,
      },
    ],
    departmentResponsible: {
      name: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
    },
    implementationGuidance: {
      name: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      documentUrl: {
        type: String,
        default: null,
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

FrameworkSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;
  delete obj.accountCreationToken;

  return obj;
};

// Load framework rules to models
FrameworkSchema.loadClass(TimeStampFormat);
// add pagination plugin
FrameworkSchema.plugin(mongoosePaginate);
const Framework = mongoose.model<IFramework>('Framework', FrameworkSchema);

export default Framework;
