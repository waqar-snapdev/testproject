import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./globals.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </BrowserRouter>
);
