import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SkipNavLink } from "@/components/common/SkipNavLink";
import Index from "./pages/Index";

const Shop = lazy(() => import("./pages/Shop"));
const Story = lazy(() => import("./pages/Story"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground"
  >
    Loading page…
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <SkipNavLink />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/story" element={<Story />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
