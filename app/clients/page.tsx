"use client";

import React from "react";
import { useGetUsersQuery, useUpdateRoleMutation } from "@/app/redux/features/user/userApi";

type UserRole = "admin" | "manager" | "user";

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function ClientList() {
  const { data, isLoading, isError } = useGetUsersQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  // Determine users array safely
  const users: User[] = Array.isArray(data) ? data : data?.users || [];

  const handleRoleChange = async (id: string, role: UserRole) => {
    try {
      await updateRole({ id, role }).unwrap();
      alert(`User role changed  to ${role}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    }
  };

  if (isLoading) return <p className="text-white text-center">Loading users...</p>;
  if (isError) return <p className="text-red-500">Failed to load users.</p>;
  if (!users.length) return <p className="text-white">No users found.</p>;

 return (
 <section className="bg-black min-h-screen">
   <div className="container mx-auto p-6">
    <h1 className="text-white text-2xl font-semibold mb-6">User Management</h1>

    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center p-5 rounded-xl bg-gray-900/50 border border-gray-700/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
        >
          {/* User Info */}
          <div className="space-y-1">
            <p className="text-lg text-white font-semibold">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>

            <span
              className={`text-xs px-2 py-1 rounded-full font-medium inline-block mt-1 ${
                user.role === "admin"
                  ? "bg-purple-700 text-white"
                  : user.role === "manager"
                  ? "bg-blue-700 text-white"
                  : "bg-green-700 text-white"
              }`}
            >
              {user.role.toUpperCase()}
            </span>
          </div>

          {/* Actions */}
          <div className="relative">
            <div className="flex gap-2">
              {user.role !== "admin" && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleRoleChange(user._id, "admin")}
                  className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  Make Admin
                </button>
              )}

              {user.role !== "manager" && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleRoleChange(user._id, "manager")}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  Make Manager
                </button>
              )}

              {user.role !== "user" && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleRoleChange(user._id, "user")}
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  Make User
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
 </section>
);

}
