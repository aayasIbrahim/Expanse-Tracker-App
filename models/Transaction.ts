import mongoose, { Schema, Document, models } from "mongoose";

export interface ITransaction extends Document {
  userId: string; // which user added this
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Transaction =
  models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
