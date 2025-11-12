import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Schema.Types.ObjectId | string;
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: "" },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> =
  models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
