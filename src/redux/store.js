import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import vendorReducer from "./slices/vendorSlice";
import categoryReducer from "./slices/categorySlice";
import cityReducer from "./slices/citySlice";
import activityCategoryReducer from "./slices/activityCategorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendor: vendorReducer,
    category: categoryReducer,
    city: cityReducer,
    activityCategory: activityCategoryReducer,
  },
});

export default store;
