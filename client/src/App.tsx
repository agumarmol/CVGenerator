import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import CvBuilder from "@/pages/cv-builder";
import Checkout from "@/pages/checkout";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Navbar from "@/components/Navbar"; // ✅ Importa el Navbar

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      {/* Mostrar Navbar solo si el usuario está logueado */}
      {isAuthenticated && <Navbar />}

      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/cv-builder" component={CvBuilder} />
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/cv-builder" component={CvBuilder} />
          </>
        )}
        <Route path="/checkout/:sessionToken" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
