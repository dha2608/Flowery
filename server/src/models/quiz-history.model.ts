import mongoose, { Schema, type Document } from 'mongoose';

export interface IQuizHistory extends Document {
  userId: mongoose.Types.ObjectId;
  input: {
    occasion: string;
    relationship: string;
    emotion: string;
    colorPreferences: string[];
    budgetMin: number;
    budgetMax: number;
  };
  results: {
    productId: mongoose.Types.ObjectId;
    flowerId?: mongoose.Types.ObjectId;
    matchScore: number;
    scoreBreakdown: {
      occasion: number;
      emotion: number;
      color: number;
      price: number;
    };
    rank: number;
  }[];
  selectedProductId?: mongoose.Types.ObjectId; // If user purchased from results
  createdAt: Date;
}

const quizHistorySchema = new Schema<IQuizHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    input: {
      occasion: { type: String, required: true },
      relationship: { type: String, required: true },
      emotion: { type: String, required: true },
      colorPreferences: [String],
      budgetMin: { type: Number, required: true },
      budgetMax: { type: Number, required: true },
    },
    results: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        flowerId: { type: Schema.Types.ObjectId, ref: 'Flower' },
        matchScore: { type: Number, required: true },
        scoreBreakdown: {
          occasion: Number,
          emotion: Number,
          color: Number,
          price: Number,
        },
        rank: Number,
      },
    ],
    selectedProductId: { type: Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true },
);

quizHistorySchema.index({ userId: 1, createdAt: -1 });

export const QuizHistory = mongoose.model<IQuizHistory>('QuizHistory', quizHistorySchema);
