import mongoose from '../../../utils/mongo';

export interface IOldPassword extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  password: string;
  changedAt: number;
}

const OldPasswordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  password: {
    type: String,
  },
  changedAt: {
    type: Number,
  },
});

const OldPassword = mongoose.model<IOldPassword>('OldPassword', OldPasswordSchema);

export default OldPassword;
