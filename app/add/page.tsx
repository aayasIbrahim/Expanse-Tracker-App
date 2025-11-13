"use client";
import React, { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import { Transaction } from "@/app/redux/features/transaction/transactionApi";
import { useAddTransactionMutation } from "@/app/redux/features/transaction/transactionApi";

export default function AddExpensePage() {
  const [showModal, setShowModal] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [addTransaction] = useAddTransactionMutation();

  // ✅ This function will be passed to TransactionForm
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Modal */}
      {showModal && (
        <TransactionForm
          transaction={selectedTransaction || undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleSubmit} // ✅ Pass onSubmit here
        />
      )}
    </div>
  );
}
