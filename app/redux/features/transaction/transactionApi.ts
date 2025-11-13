import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Transaction {
  _id: string;
  userId: User;
  type: string;
  category: string;
  amount: number;
  note?: string;
  date: string;
}

interface GetTransactionResponse {
  success: boolean;
  transactions: Transaction[];
}

// ✅ Create API Slice
export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/transactions" }),
  tagTypes: ["Transaction"],

  endpoints: (builder) => ({
    // ✅ Get all transactions (admin → all, user → own)
    getTransactions: builder.query<GetTransactionResponse, void>({
      query: () => "/",
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
