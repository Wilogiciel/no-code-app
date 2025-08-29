import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <header>
            {/* Header renders inside BrowserRouter to allow Links */}
            {/**/}
          </header>
          {/* Lazy import to avoid SSR concerns */}
          {(() => {
            const Header = require("@/components/layout/Header").default;
            return <Header />;
          })()}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/studio" element={(() => {
                const Studio = require("./pages/Studio").default;
                return <Studio />;
              })()} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {(() => {
            const Footer = require("@/components/layout/Footer").default;
            return <Footer />;
          })()}
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
