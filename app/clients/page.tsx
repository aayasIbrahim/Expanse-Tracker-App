"use client";
import React, { useState } from "react";

// Example client data — replace later with MongoDB fetch
const sampleClients = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "user", createdAt: "2025-01-01" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", createdAt: "2025-02-15" },
  { id: 3, name: "Admin User", email: "admin@example.com", role: "admin", createdAt: "2025-01-05" },
];

export default function Clients() {
  const [clients, setClients] = useState(sampleClients);
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((c) => c.id !== id));
      alert("Client deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">Clients Management</h1>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or email..."
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
              <th className="px-6 py-3 text-left text-gray-300">Name</th>
              <th className="px-6 py-3 text-left text-gray-300">Email</th>
              <th className="px-6 py-3 text-left text-gray-300">Role</th>
              <th className="px-6 py-3 text-left text-gray-300">Created At</th>
              <th className="px-6 py-3 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No clients found.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4">{client.name}</td>
                  <td className="px-6 py-4">{client.email}</td>
                  <td className="px-6 py-4 capitalize">{client.role}</td>
                  <td className="px-6 py-4">{client.createdAt}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm"
                      onClick={() => alert("Edit functionality coming soon!")}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                      onClick={() => handleDelete(client.id)}
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
        {filteredClients.length === 0 ? (
          <p className="text-center text-gray-400">No clients found.</p>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-800"
            >
              <h2 className="text-lg font-semibold text-green-400">{client.name}</h2>
              <p className="text-gray-300">{client.email}</p>
              <p className="capitalize text-gray-300">Role: {client.role}</p>
              <p className="text-gray-400 text-sm">Created: {client.createdAt}</p>
              <div className="mt-3 flex gap-3">
                <button
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm"
                  onClick={() => alert("Edit functionality coming soon!")}
                >
                  Edit
                </button>
                <button
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                  onClick={() => handleDelete(client.id)}
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
