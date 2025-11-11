"use client";
import React, { useState } from "react";

export default function Settings() {
  const [currency, setCurrency] = useState("USD");
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState(["Food", "Transport", "Salary", "Shopping"]);

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">Admin Settings</h1>

      {/* Currency Setting */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">Currency</h2>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full max-w-xs px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="BDT">BDT (৳)</option>
        </select>
      </div>

      {/* Registration Setting */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 mb-6 flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-xl font-semibold mb-4 sm:mb-0 text-gray-300">User Registration</h2>
        <label className="flex items-center gap-3">
          <span className="text-gray-300">{registrationEnabled ? "Enabled" : "Disabled"}</span>
          <input
            type="checkbox"
            checked={registrationEnabled}
            onChange={() => setRegistrationEnabled(!registrationEnabled)}
            className="w-6 h-6 accent-green-500"
          />
        </label>
      </div>

      {/* Expense Categories */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">Expense Categories</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="New category..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-gray-200"
            >
              <span>{cat}</span>
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="text-red-500 hover:text-red-600 font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
