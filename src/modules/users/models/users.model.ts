import mongoosePaginate from 'mongoose-paginate-v2';
import { userTypes } from '../users.enum';
import { env } from '../../../utils/misc';
import bcrypt from 'bcrypt';
import TimeStampFormat from '../../../utils/timestampFormat';
import { IRole } from '../../role/role.model';
import mongoose from 'mongoose';
import { IBusiness } from '../../businessEntity/business.model';

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

interface DeviceInfo {
  browser: string;
  version: string;
  os: string;
  platform: string;
}

export interface ILoginInfo extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  ipAddress: string;
  loginDate: Date;
  deviceInfo: DeviceInfo;
}

export interface IOldPassword extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  password: string;
  changedAt: number;
}

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userType: string;
  photo: string;
  email: string;
  oldPasswords: IOldPassword[];
  password?: string;
  status: string;
  loginAttempts: number;
  isBlocked: boolean;
  firstName: string;
  lastName: string;
  middleName: string;
  mobile: string;
  gender: string;
  loginTimes: Date;
  loginInfo: ILoginInfo;
  firstTimeLogin: boolean;
  active: boolean;
  passwordChangedAt?: number;
  businessId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  passwordExpiry?: Date;
  resetPasswordToken?: string;
  accountChallengeToken: string;
  registerUserToken?: string;
  hasAcceptedInvite: string;
  isOwner: boolean;
  resetPasswordExpires: Date | null;
  otp: string;
  otpExpires: Date;
  environment: string;
  createdAt: Date;
  updatedAt: Date;
  role: IRole | null;
  business: IBusiness | null;
  permissions: string[];
  isAdmin: boolean;
}

const LoginInfoSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    default: null,
  },
  loginDate: {
    type: Date,
    default: Date.now(),
  },
  deviceInfo: {
    browser: {
      type: String,
      default: null,
    },
    version: {
      type: String,
      default: null,
    },
    os: {
      type: String,
      default: null,
    },
    platform: {
      type: String,
      default: null,
    },
  },
});

const OldPasswordSchema = new mongoose.Schema({
  password: {
    type: String,
  },
  changedAt: {
    type: Number,
  },
});

const UserSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: [...Object.values(userTypes)],
      default: 'business',
    },
    photo: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    oldPasswords: {
      type: [OldPasswordSchema],
    },
    password: {
      type: String,
      minlength: 8,
    },
    status: {
      type: String,
      enum: ['activated', 'invited', 'deactivated', 'not_invited'],
      default: 'not_invited',
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    middleName: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      default: '',
    },
    loginTime: [
      {
        type: Date,
        default: [],
      },
    ],
    loginInfo: {
      type: [LoginInfoSchema],
      default: [],
    },
    firstTimeLogin: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Number,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    passwordExpiry: {
      type: Date,
      default() {
        const passwordExpiryDate = new Date();
        passwordExpiryDate.setFullYear(passwordExpiryDate.getFullYear() + 1);
        return passwordExpiryDate;
      },
    },
    resetPasswordToken: {
      type: String,
    },
    accountChallengeToken: {
      type: String,
    },
    registerUserToken: {
      type: String,
    },
    hasAcceptedInvite: {
      type: Boolean,
      default: false,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    resetPasswordExpires: {
      type: Date,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    environment: {
      type: String,
      default: `${env('APP_ENV')}`,
    },
    permissions: [
      {
        type: String,
      },
    ],
    yearFounded: {
      type: String,
      default: '',
    },
    overview: {
      type: String,
      default: '',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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
    // strictPopulate: false
  },
);

UserSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  jsonOne: true,
});

UserSchema.virtual('business', {
  ref: 'Business',
  localField: 'businessId',
  foreignField: '_id',
  justOne: true,
});

UserSchema.methods.setPassword = async function (password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordhash = await bcrypt.hash(password, salt);
    this.password = passwordhash;
    return this;
  } catch (error: any) {
    throw new Error(error);
  }
};

UserSchema.methods.isValidPassword = async function (newPassword: string) {
  try {
    return await bcrypt.compare(newPassword, this.password || '');
  } catch (error: any) {
    throw new Error(error);
  }
};

UserSchema.methods.checkOldPassword = async function (newPassword: string) {
  try {
    let result = false;
    for (let i = 0; i < this.oldPasswords.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      if (await bcrypt.compare(newPassword, this.oldPasswords[i].password)) {
        result = this.oldPasswords[i];
        break;
      }
    }
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

UserSchema.index(
  {
    resetPasswordToken: 1,
    resetPasswordExpires: 1,
  },
  {
    background: true,
    partialFilterExpression: {
      resetPasswordToken: {
        $exists: true,
      },
      resetPasswordExpires: {
        $exists: true,
      },
    },
  },
);

UserSchema.index(
  {
    registerUserToken: 1,
  },
  {
    background: true,
    partialFilterExpression: {
      registerUserToken: {
        $exists: true,
      },
    },
  },
);

UserSchema.index(
  {
    email: 1,
    accountChallengeToken: 1,
  },
  {
    background: true,
    partialFilterExpression: {
      accountChallengeToken: {
        $exists: true,
      },
    },
  },
);

UserSchema.index(
  {
    roleId: 1,
    businessId: 1,
    createdAt: -1,
  },
  { background: true },
);

UserSchema.index(
  {
    roleId: 1,
    businessId: 1,
    hasAcceptedInvite: 1,
  },
  { background: true },
);

UserSchema.index(
  {
    businessId: 1,
    createdAt: -1,
  },
  { background: true },
);

UserSchema.index(
  {
    firstName: 'text',
    middleName: 'text',
    lastName: 'text',
    email: 'text',
  },
  { background: true },
);

// eslint-disable-next-line func-names
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  // delete obj.resetPasswordToken;
  // delete obj.resetPasswordExpires;
  delete obj.passwordChangedAt;
  // delete obj.accountChallengeToken;
  delete obj.loginCount;
  delete obj.loginattempts;
  delete obj.isBlocked;
  delete obj.oldPasswords;
  return obj;
};

UserSchema.loadClass(TimeStampFormat);

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
