import mongoose, { Schema } from 'mongoose';

const BudgetSchema = new Schema(
  {
    category: { type: String, required: true },
    month: { type: Number, required: true }, 
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
