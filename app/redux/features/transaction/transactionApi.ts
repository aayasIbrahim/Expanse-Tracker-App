import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Transaction {
  _id: string;
  userId: User;
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
  date: string;
}


interface GetTransactionResponse {
  success: boolean;
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}


// ✅ Create API Slice
export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/transactions" }),
  tagTypes: ["Transaction"],

  endpoints: (builder) => ({
    // ✅ Get all transactions with pagination
    getTransactions: builder.query<
      GetTransactionResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.transactions.map(({ _id }) => ({
                type: "Transaction" as const,
                id: _id,
              })),
              { type: "Transaction", id: "LIST" },
            ]
          : [{ type: "Transaction", id: "LIST" }],
    }),

    // ✅ Get single transaction by ID
    getTransactionById: builder.query<Transaction, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),

    // ✅ Add new transaction
    addTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Transaction", id: "LIST" }],
    }),

    // ✅ Update existing transaction
    updateTransaction: builder.mutation<
      Transaction,
      { id: string; data: Partial<Transaction> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Transaction", id },
        { type: "Transaction", id: "LIST" },
      ],
    }),

    // ✅ Delete transaction
    deleteTransaction: builder.mutation<{ success: boolean; id: string }, string>(
      {
        query: (id) => ({
          url: `/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Transaction", id },
          { type: "Transaction", id: "LIST" },
        ],
      }
    ),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;