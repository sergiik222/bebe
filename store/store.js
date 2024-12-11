import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {thunk} from "redux-thunk";
import {rootReducer} from "./root-reducer";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["temporaryState"], // Example: Exclude certain reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
