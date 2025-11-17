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
      alert(`User role changed to ${role}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    }
  };

  if (isLoading) return <p className="text-white">Loading users...</p>;
  if (isError) return <p className="text-red-500">Failed to load users.</p>;
  if (!users.length) return <p className="text-white">No users found.</p>;

  return (
    <div className="bg-black min-h-screen p-5">
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center border border-gray-700 p-4 rounded shadow-sm hover:shadow-md transition-shadow bg-gray-900"
          >
            <div>
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-xs text-gray-500">Role: {user.role}</p>
            </div>

            <div className="flex gap-2">
              {user.role !== "admin" && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleRoleChange(user._id, "admin")}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Make Admin
                </button>
              )}

              {user.role !== "manager" && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleRoleChange(user._id, "manager")}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Make Manager
                </button>
              )}

              {user.role !== "user" && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleRoleChange(user._id, "user")}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Make User
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
