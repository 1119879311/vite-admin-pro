import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "@/storeRedux";
import { Provider } from "react-redux";
import "@alifd/next/dist/next.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);
