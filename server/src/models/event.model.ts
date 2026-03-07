import mongoose, { Schema, type Document } from 'mongoose';

export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId;
  relationshipId?: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  type: 'birthday' | 'anniversary' | 'holiday' | 'graduation' | 'wedding' | 'custom';
  description?: string;
  reminderSettings: {
    enabled: boolean;
    daysBefore: number[];
    channels: ('push' | 'email' | 'sms')[];
  };
  isRecurring: boolean;
  recurrencePattern?: 'yearly' | 'monthly';
  lastNotifiedAt?: Date;
  linkedOrderId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    relationshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Relationship',
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    type: {
      type: String,
      enum: ['birthday', 'anniversary', 'holiday', 'graduation', 'wedding', 'custom'],
      required: true,
    },
    description: { type: String, maxlength: 500 },
    reminderSettings: {
      enabled: { type: Boolean, default: true },
      daysBefore: { type: [Number], default: [7, 3, 1] },
      channels: {
        type: [String],
        enum: ['push', 'email', 'sms'],
        default: ['push', 'email'],
      },
    },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: {
      type: String,
      enum: ['yearly', 'monthly'],
    },
    lastNotifiedAt: Date,
    linkedOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

eventSchema.index({ userId: 1, date: 1 });
eventSchema.index({ date: 1, 'reminderSettings.enabled': 1 });
eventSchema.index({ userId: 1, type: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
