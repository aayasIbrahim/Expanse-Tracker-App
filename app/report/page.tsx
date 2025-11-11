"use client";
import React from "react";
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

export default function Report() {
  // Sample Data (you can later fetch from MongoDB or Firebase)
  const data = [
    { month: "Jan", income: 2500, expense: 1800 },
    { month: "Feb", income: 3000, expense: 2200 },
    { month: "Mar", income: 2800, expense: 2500 },
    { month: "Apr", income: 3500, expense: 2700 },
    { month: "May", income: 3200, expense: 2000 },
    { month: "Jun", income: 4000, expense: 2900 },
  ];

  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
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
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">
          Income vs Expense Overview
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
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
              <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
