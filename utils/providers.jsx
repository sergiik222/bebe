'use client';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import { LanguageProvider } from "@/lib/LanguageContext";

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </PersistGate>
        </Provider>
    );
}
