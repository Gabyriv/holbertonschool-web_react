import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./app/store.js";
import App from "./App.jsx";
import "@fontsource/roboto/400.css"; // Regular weight for normal body text
import "@fontsource/roboto/500.css"; // Medium weight for semi-emphasized text
import "@fontsource/roboto/700.css"; // Bold weight for headings and strong emphasis
import "./main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
