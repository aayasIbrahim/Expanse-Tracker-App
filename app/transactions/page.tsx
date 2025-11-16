"use client";
import React, { useState } from "react";
import {
  Transaction,
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "@/app/redux/features/transaction/transactionApi";
import TransactionForm from "@/components/TransactionForm";
import Pagination from "@/components/Pagination";


export default function Transactions() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetTransactionsQuery({ page, limit });
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const [search, setSearch] = useState("");
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);

  const transactions = data?.transactions || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const filteredTransactions = transactions.filter((t) => {
    const userName = t.userId?.name?.toLowerCase() ?? "";
    const category = t.category?.toLowerCase() ?? "";
    const searchTerm = search.toLowerCase();
    return userName.includes(searchTerm) || category.includes(searchTerm);
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteTransaction(id).unwrap();
      alert("Deleted successfully!");
    } catch {
      alert("Failed to delete!");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setShowModal(true);
  };

  const handleUpdate = async (updatedData: Partial<Transaction>) => {
    if (!editTransaction) return;
    try {
      await updateTransaction({ id: editTransaction._id, data: updatedData }).unwrap();
      setShowModal(false);
      setEditTransaction(null);
      alert("Updated successfully!");
    } catch {
      alert("Failed to update!");
    }
  };

  if (isLoading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Failed to load</p>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-green-400 text-center mb-6">Transactions</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by user or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-800 rounded-xl">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-gray-300">Name</th>
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
                  <td className="px-6 py-4">{t.userId?.name}</td>
                  <td className={`px-6 py-4 ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    {t.type}
                  </td>
                  <td className="px-6 py-4">{t.category}</td>
                  <td className="px-6 py-4">{t.amount.toLocaleString()} tk</td>
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{t.note || "-"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="bg-green-600 px-3 py-1 rounded" onClick={() => handleEdit(t)}>
                      Edit
                    </button>
                    <button className="bg-red-600 px-3 py-1 rounded" onClick={() => handleDelete(t._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {showModal && editTransaction && (
        <TransactionForm
          transaction={editTransaction}
          onClose={() => {
            setShowModal(false);
            setEditTransaction(null);
          }}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}