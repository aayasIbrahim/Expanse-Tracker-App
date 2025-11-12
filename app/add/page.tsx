"use client";
import React, { useState } from "react";

export default function AddExpense() {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const categories =
    type === "expense"
      ? ["Food", "Transport", "Shopping", "Bills", "Health", "Other"]
      : ["Salary", "Business", "Freelance", "Investments", "Other"];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newTransaction = { type, category, amount: Number(amount), note, date };

  try {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    });

    if (res.ok) {
      alert("✅ Transaction Added Successfully!");
      setAmount("");
      setCategory("");
      setNote("");
      setDate("");
    } else {
      const error = await res.json();
      alert("❌ Failed: " + error.error);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Something went wrong!");
  }
};

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-400">
          Add New {type === "expense" ? "Expense" : "Income"}
        </h1>

        {/* Transaction Type Toggle */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setType("expense")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              type === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("income")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              type === "income"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount */}
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-300">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-300">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Add {type === "expense" ? "Expense" : "Income"}
          </button>
        </form>
      </div>
    </div>
  );
}
