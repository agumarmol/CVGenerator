import { HeroIntro } from "@/components/cv-builder/hero-intro";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function Landing() {
  const [, setLocation] = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 👇 Consultar si ya hay sesión iniciada al cargar la página
  useEffect(() => {
    fetch("/api/auth/user", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No authenticated");
      })
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  const handleGetStarted = () => {
    setLocation("/cv-builder");
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // 👈 importante para sesiones
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login exitoso:", data);
        setCurrentUser(data.user); // actualizar el estado del usuario
        setShowLoginModal(false);
      } else {
        console.error("Error login:", data.message);
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed, check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-primary-foreground text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CVMaster Pro</h1>
                <p className="text-xs text-muted-foreground">
                  AI-Powered CV Generation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-sm">
                    👋 Hola, {currentUser.firstName}
                  </span>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleLoginClick}
                  data-testid="button-login"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <HeroIntro onGetStarted={handleGetStarted} />
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 CVMaster Pro. Professional CV generation made simple.</p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-shield-alt text-accent"></i>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-magic text-primary"></i>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-globe text-secondary-foreground"></i>
                <span>Multi-Language</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-muted-foreground text-xl font-bold"
              onClick={() => setShowLoginModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-border rounded px-3 py-2"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
