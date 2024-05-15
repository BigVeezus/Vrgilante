import mongoose from '../../../utils/mongo';

interface DeviceInfo {
  browser: string;
  version: string;
  os: string;
  platform: string;
}

export interface ILoginInfo extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ipAddress: string;
  loginDate: Date;
  deviceInfo: DeviceInfo;
}

const LoginInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
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

const LoginInfo = mongoose.model<ILoginInfo>('LoginInfo', LoginInfoSchema);

export default LoginInfo;
