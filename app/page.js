'use client'
import MediaComponent from "@/components/MediaComponent";
import {persistor, store} from "@/store/store";
import {Provider} from "react-redux";

import {PersistGate} from "redux-persist/integration/react";

export default function Home() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full h-screen">
                    <main>
                        <section>
                            <MediaComponent />
                        </section>
                    </main>
                </div>
            </PersistGate>
        </Provider>
    );
}

