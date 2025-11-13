"use client";
import React, { useState } from "react";
import {
  Transaction,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
} from "@/app/redux/features/transaction/transactionApi";

interface TransactionFormProps {
  transaction?: Transaction;
  onClose: () => void;
  onSubmit?: (data: Partial<Transaction>) => Promise<void>; // optional
}

export default function TransactionForm({
  transaction,
  onClose,
}: TransactionFormProps) {
  const isEdit = Boolean(transaction);

  const [type, setType] = useState<Transaction["type"]>(
    transaction?.type || "expense"
  );
  const [category, setCategory] = useState(transaction?.category || "");
  const [amount, setAmount] = useState(transaction?.amount?.toString() || "");
  const [note, setNote] = useState(transaction?.note || "");
  const [date, setDate] = useState(transaction?.date || "");

  const [submitting, setSubmitting] = useState(false);

  const categories =
    type === "expense"
      ? ["Teacher fee", "Manager fee", "Venue Cost", "Other"]
      : [
          "Science Student",
          "Business Student",
          "Humanities student",
          "Investments",
          "Other",
        ];

  const [addTransaction, { isLoading: adding }] = useAddTransactionMutation();
  const [updateTransaction, { isLoading: updating }] =
    useUpdateTransactionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return; // prevent double submit
    setSubmitting(true);

    const payload: Partial<Transaction> = {
      type,
      category,
      amount: Number(amount),
      note,
      date,
    };
    try {
      if (isEdit && transaction?._id) {
        await updateTransaction({
          id: transaction._id,
          data: payload,
        }).unwrap();
        alert("✅ Transaction updated successfully!");
      } else {
        await addTransaction(payload).unwrap();
        alert("✅ Transaction added successfully!");
      }

      onClose(); // just close modal, don’t call onSubmit again
    } catch (error) {
      console.error("Transaction save error:", error);
      alert("❌ Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`px-4 py-2 rounded-full ${
              type === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`px-4 py-2 rounded-full ${
              type === "income"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />

          <div className="flex justify-between gap-4 mt-2">
            <button
              type="submit"
              disabled={adding || updating || submitting}
              className="flex-1 py-3 bg-green-600 rounded-lg hover:bg-green-700"
            >
              {isEdit
                ? updating
                  ? "Updating..."
                  : "Update"
                : adding
                ? "Adding..."
                : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
