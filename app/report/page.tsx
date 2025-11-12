"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string; // ISO string
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export default function Report() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Process transactions into monthly data
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyData: MonthlyData[] = months.map((month, index) => {
    const monthTransactions = transactions.filter(
      (t) => new Date(t.date).getMonth() === index
    );

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { month, income, expense };
  });

  const totalIncome = monthlyData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = monthlyData.reduce((sum, d) => sum + d.expense, 0);
  const balance = totalIncome - totalExpense;

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">
        Monthly Report
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

      {/* Bar Chart */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-300 text-center sm:text-left">
          Income vs Expense Overview
        </h2>
        <div className="w-full h-72 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
