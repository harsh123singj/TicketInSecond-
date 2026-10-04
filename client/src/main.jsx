import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthProvider";
import { EventProvider } from "./context/EventContext";

// Prevent browser from restoring the previous scroll position
if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <EventProvider>
                    <App />
                </EventProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);