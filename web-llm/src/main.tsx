import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import ChatPage from "./pages/ChatPage.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
