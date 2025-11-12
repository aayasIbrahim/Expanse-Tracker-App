"use client";

import React, { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
  date: string;
}

export default function ManagerDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transactions from API
useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch transactions");
      }

      setTransactions(data.transactions || []);
    } catch (err: unknown) {
      // ✅ Use 'unknown' instead of 'any'
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchTransactions();
}, []);
  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <section className="min-h-screen bg-black text-white px-6 py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">
          Manager Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 text-center">
            <h2 className="text-gray-400 mb-2">Total Income</h2>
            <p className="text-2xl font-bold text-green-500">${totalIncome}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 text-center">
            <h2 className="text-gray-400 mb-2">Total Expense</h2>
            <p className="text-2xl font-bold text-red-500">${totalExpense}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 text-center">
            <h2 className="text-gray-400 mb-2">Balance</h2>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ${balance}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="grid grid-cols-1 gap-4">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-800"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-semibold ${
                    t.type === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {t.type.toUpperCase()}
                </span>
                <span className="text-gray-400 text-sm">{new Date(t.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-300">Category: {t.category}</p>
              <p className="text-gray-300">Amount: ${t.amount}</p>
              <p className="text-gray-400 text-sm">Note: {t.note || "-"}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
