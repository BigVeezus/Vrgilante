import mongoose from '../../../utils/mongo';

export interface IReply extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  commentId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  text: string;
}

const ReplySchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
  },
  { timestamps: true },
);

const Reply = mongoose.model<IReply>('Reply', ReplySchema);

export default Reply;
