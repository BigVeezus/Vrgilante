import mongoose from '../../utils/mongo';

export interface ITask extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  dueDate: Date;
  reminder?: Date;
  status: string;
  priority: string;
  tags?: string[];
  attachments?: [
    {
      url: string;
      description: string;
    },
  ];
}

const TaskSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    dueDate: {
      type: Date,
    },
    reminder: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        url: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
