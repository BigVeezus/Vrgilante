import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  status: string;
  readAt: Date;
  entity: {
    action: string;
    type: string;
    entityId: mongoose.Types.ObjectId;
  };
}

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
      default: 'unread',
    },
    entity: {
      action: {
        type: String,
        default: null,
      },
      type: {
        type: String,
        default: '',
      },
      entityId: {
        type: mongoose.Types.ObjectId,
      },
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
