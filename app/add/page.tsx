"use client";
import React, { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import { Transaction } from "@/app/redux/features/transaction/transactionApi";
import { useAddTransactionMutation } from "@/app/redux/features/transaction/transactionApi";

export default function AddExpensePage() {
  const [showModal, setShowModal] = useState(false); // ❗ Default false
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [addTransaction] = useAddTransactionMutation();

  const handleSubmit = async (data: Partial<Transaction>) => {
    try {
      await addTransaction(data).unwrap();
      alert("Transaction added successfully!");
      setShowModal(false);
    } catch {
      alert("Failed to add transaction.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4">
      {/* Page Header */}
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold">Add Expense / Income</h1>

        <button
          onClick={() => setShowModal(true)}
          className="mt-5 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700"
        >
          Add New Transaction
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <TransactionForm
          transaction={selectedTransaction || undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
