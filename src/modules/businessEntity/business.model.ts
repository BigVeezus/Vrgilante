import mongoose from '../../utils/mongo';
import mongoosePaginate from 'mongoose-paginate-v2';
import { companyEntityTypes } from './business.constant';
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

export interface IBusiness extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  businessInformation: {
    registrationnumber?: string;
    legalName?: string;
    logo?: string;
    companyEntityType?: string;
    tagline?: string;
    industry: string;
    displayName?: string;
  };
  contactInformation: {
    supportPhone?: string;
    billingEmail?: string;
    supportEmail?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    careerWebsite?: string;
  };
  registeredAddress: {
    flatNumber?: string;
    buildingName?: string;
    landmark?: string;
    buildingNumber?: string;
    street?: string;
    subStreet?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  officeAddress: {
    flatNumber?: string;
    buildingName?: string;
    landmark?: string;
    buildingNumber?: string;
    street?: string;
    zipCode?: string;
    subStreet?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  policyInformation: {
    termsOfUse?: string;
    privacyPolicy?: string;
    serviceAgreement?: string;
    faq?: string;
  };
  doesBusinessConsent: boolean;
  // companyName?: string;
  type: string[];
  slugPrefix: string;
  isVerified: boolean;
  isRestricted: boolean;
  completedTakeALookAround: boolean;
  reasonsForSuspension?: string;
  active: boolean;
  permissions: string[];
  integrations: [mongoose.Types.ObjectId];
  policies: [mongoose.Types.ObjectId];
  status: string;
  lastSeen: Date;
  accountCreationToken: string;
  yearFounded?: string;
  completedTaskALookAround?: boolean;
}
const BusinessSchema = new mongoose.Schema(
  {
    businessInformation: {
      registrationnumber: {
        type: String,
        // required: true,
        default: null,
      },
      legalName: {
        type: String,
        // required: true,
        default: null,
      },
      logo: {
        type: String,
        default: null,
      },
      companyEntityType: {
        type: String,
        enum: [...Object.keys(companyEntityTypes), null],
        // required: true,
        default: null,
      },
      tagline: {
        type: String,
        default: null,
      },
      industry: {
        type: String,
        default: null,
      },
      displayName: {
        type: String,
        default: null,
      },
    },
    yearFounded: {
      type: String,
      default: null,
    },
    completedTaskALookAround: {
      type: Boolean,
      default: false,
    },
    contactInformation: {
      supportPhone: {
        type: String,
        // required: true,
        default: null,
      },
      billingEmail: {
        type: String,
        default: null,
      },
      supportEmail: {
        type: String,
        // required: true,
        default: null,
      },
      website: {
        type: String,
        default: null,
      },
      facebook: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
      careerWebsite: {
        type: String,
        default: null,
      },
    },
    registeredAddress: {
      flatNumber: {
        type: String,
        default: null,
      },
      buildingName: {
        type: String,
        default: null,
      },
      landmark: {
        type: String,
        default: null,
      },
      buildingNumber: {
        type: String,
        default: null,
      },
      street: {
        type: String,
        default: null,
      },
      subStreet: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
    },
    officeAddress: {
      flatNumber: {
        type: String,
        default: null,
      },
      buildingName: {
        type: String,
        default: null,
      },
      landmark: {
        type: String,
        default: null,
      },
      buildingNumber: {
        type: String,
        default: null,
      },
      street: {
        type: String,
        default: null,
      },
      subStreet: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
    },
    policyInformation: {
      termsOfUse: {
        type: String,
        default: null,
      },
      privacyPolicy: {
        type: String,
        default: null,
      },
      serviceAgreement: {
        type: String,
        default: null,
      },
      faq: {
        type: String,
        default: null,
      },
    },
    doesBusinessConsent: {
      type: Boolean,
      default: false,
    },
    // companyName: {
    //   type: String,
    //   default: null,
    // },
    type: {
      type: String,
      enum: ['standard', 'premium', 'admin'],
      default: 'standard',
    },
    slugPrefix: {
      type: String,
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isRestricted: {
      type: Boolean,
      default: false,
    },
    completedTakeALookAround: {
      type: Boolean,
      default: false,
    },
    reasonsForSuspension: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    permissions: [
      {
        type: String,
      },
    ],
    integrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Integration' }],
    policies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
    status: {
      type: String,
      default: 'pending',
      enum: ['activated', 'deactivated', 'pending-activation', 'invited'],
    },
    lastSeen: Date,
    accountCreationToken: {
      type: String,
      // required: true,
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

BusinessSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj.__v;
  delete obj.accountCreationToken;

  return obj;
};

// Load business rules to models
BusinessSchema.loadClass(TimeStampFormat);
// add pagination plugin
BusinessSchema.plugin(mongoosePaginate);
const Business = mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;
