import { configureStore } from "@reduxjs/toolkit";
import { transactionApi } from "@/app/redux/features/transaction/transactionApi"; // 👈 তোমার api ফাইল
import { setupListeners } from "@reduxjs/toolkit/query";

// 🏪 Create the Redux store
export const store = configureStore({
  reducer: {
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionApi.middleware),
});

// 👂 Enable refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// 🧩 Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
