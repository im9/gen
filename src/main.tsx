import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Lissajous } from "./components/Lissajous";

const rootElement: HTMLElement | null = document.getElementById("root");
const root = rootElement ? createRoot(rootElement) : null;

root?.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="lissajous" element={<Lissajous />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
