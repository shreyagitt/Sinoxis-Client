import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
// add other feature APIs here and their slices if needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    
    // add other apis like releaseApi.reducerPath: releaseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

// types for use throughout app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
