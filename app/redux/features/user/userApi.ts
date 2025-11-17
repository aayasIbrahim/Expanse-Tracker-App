import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ------------------ Types ------------------ */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetUsersResponse {
  users: IUser[];
}

export interface IUpdateRoleRequest {
  id: string;
  role: "admin" | "manager" | "user";
}

export interface IUpdateRoleResponse {
  message: string;
  user: IUser;
}

/* ------------------ API Slice ------------------ */

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<IGetUsersResponse, void>({
      query: () => `/users`,
      providesTags: ["Users"],
    }),

    // Update user role
    updateRole: builder.mutation<IUpdateRoleResponse, IUpdateRoleRequest>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateRoleMutation } = userApi;
