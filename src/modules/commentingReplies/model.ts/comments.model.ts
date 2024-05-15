import mongoose from '../../../utils/mongo';

export interface IComments extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  text: string;
  entity: string;
  replyCount?: number;
  taskId?: mongoose.Types.ObjectId;
}

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      default: 'task',
    },
    replyCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    taskId: {
      type: mongoose.Types.ObjectId,
      ref: 'Task',
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model<IComments>('Comment', CommentSchema);

export default Comment;
