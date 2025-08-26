import { HeroIntro } from "@/components/cv-builder/hero-intro";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/cv-builder");
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
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
                <p className="text-xs text-muted-foreground">AI-Powered CV Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleLogin}
                data-testid="button-login"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Sign In
              </Button>
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
    </div>
  );
}