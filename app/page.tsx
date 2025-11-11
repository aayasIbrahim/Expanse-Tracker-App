"use client";
import React from "react";

const managerTransactions = [
  { id: 1, type: "income", amount: 2000, category: "Project Payment", date: "2025-01-05", note: "Client A" },
  { id: 2, type: "expense", amount: 300, category: "Transport", date: "2025-01-06", note: "Taxi fare" },
  { id: 3, type: "expense", amount: 150, category: "Food", date: "2025-01-07", note: "Lunch" },
];

export default function ManagerDashboard() {
  const totalIncome = managerTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = managerTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
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
          <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${balance}
          </p>
        </div>
      </div>


      {/* Transactions Cards (Mobile) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {managerTransactions.map((t) => (
          <div key={t.id} className="bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {t.type.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">{t.date}</span>
            </div>
            <p className="text-gray-300">Category: {t.category}</p>
            <p className="text-gray-300">Amount: ${t.amount}</p>
            <p className="text-gray-400 text-sm">Note: {t.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
