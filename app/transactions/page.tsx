"use client";
import React, { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  user: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string; // ISO string
  note?: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch transactions");

        setTransactions(data.transactions || []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

 const filteredTransactions = transactions.filter(
  (t) =>
    (t.user?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (t.category?.toLowerCase() ?? "").includes(search.toLowerCase())
);


  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete transaction");

      setTransactions(transactions.filter((t) => t._id !== id));
      alert("Transaction deleted successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Unexpected error occurred.");
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">Transactions Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 text-center">
          <h2 className="text-gray-400 mb-2">Total Income</h2>
          <p className="text-2xl font-bold text-green-500">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 text-center">
          <h2 className="text-gray-400 mb-2">Total Expense</h2>
          <p className="text-2xl font-bold text-red-500">${totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 text-center">
          <h2 className="text-gray-400 mb-2">Balance</h2>
          <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by user or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-gray-300">User</th>
              <th className="px-6 py-3 text-left text-gray-300">Type</th>
              <th className="px-6 py-3 text-left text-gray-300">Category</th>
              <th className="px-6 py-3 text-left text-gray-300">Amount</th>
              <th className="px-6 py-3 text-left text-gray-300">Date</th>
              <th className="px-6 py-3 text-left text-gray-300">Note</th>
              <th className="px-6 py-3 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="px-6 py-4">{t.user}</td>
                  <td className={`px-6 py-4 capitalize ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    {t.type}
                  </td>
                  <td className="px-6 py-4">{t.category}</td>
                  <td className="px-6 py-4">${t.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{t.note || "-"}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm"
                      onClick={() => alert("Edit functionality coming soon!")}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-400">No transactions found.</p>
        ) : (
          filteredTransactions.map((t) => (
            <div key={t._id} className="bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-800">
              <h2 className="text-lg font-semibold text-green-400">{t.user}</h2>
              <p className={`capitalize ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {t.type}
              </p>
              <p className="text-gray-300">Category: {t.category}</p>
              <p className="text-gray-300">Amount: ${t.amount.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Date: {new Date(t.date).toLocaleDateString()}</p>
              <p className="text-gray-400 text-sm">Note: {t.note || "-"}</p>
              <div className="mt-3 flex gap-3">
                <button
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm"
                  onClick={() => alert("Edit functionality coming soon!")}
                >
                  Edit
                </button>
                <button
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
