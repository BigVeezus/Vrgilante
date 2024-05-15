import mongoose from 'mongoose';

export interface IRevokedToken extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  token: string;
}

const RevokedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const RevokedToken = mongoose.model<IRevokedToken>('RevokedToken', RevokedTokenSchema);

export default RevokedToken;
