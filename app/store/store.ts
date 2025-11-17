import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { transactionApi } from "@/app/redux/features/transaction/transactionApi";
import { userApi } from "@/app/redux/features/user/userApi"; // 

export const store = configureStore({
  reducer: {
    [transactionApi.reducerPath]: transactionApi.reducer,
    [userApi.reducerPath]: userApi.reducer, // 
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(transactionApi.middleware)
      .concat(userApi.middleware), // 
});

setupListeners(store.dispatch);

// 🔥 Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
