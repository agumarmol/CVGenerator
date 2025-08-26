import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleCreateCV = () => {
    setLocation("/cv-builder");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
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
              <div className="flex items-center space-x-2">
                {(user as any)?.profileImageUrl && (
                  <img 
                    src={(user as any).profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-foreground">
                  {(user as any)?.firstName || (user as any)?.email || 'User'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome back, {(user as any)?.firstName || 'there'}!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to create your next professional CV? Our AI-powered platform helps you build stunning resumes that get noticed.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Create New CV */}
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={handleCreateCV}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-plus text-primary text-2xl"></i>
              </div>
              <CardTitle className="text-xl">Create New CV</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Start building a professional CV from scratch with our guided wizard
              </p>
              <Button className="w-full" data-testid="button-create-cv">
                <i className="fas fa-file-plus mr-2"></i>
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-crown text-yellow-600 text-2xl"></i>
              </div>
              <CardTitle className="text-xl flex items-center justify-center space-x-2">
                <span>Premium Features</span>
                <Badge className="premium-badge text-xs">
                  $9.99
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  50+ Professional Templates
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  15 Language Support
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  AI Content Enhancement
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  Unlimited Downloads
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                <i className="fas fa-star mr-2"></i>
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Import Existing CV */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-upload text-accent text-2xl"></i>
              </div>
              <CardTitle className="text-xl">Import CV</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Upload your existing PDF resume and let AI enhance it
              </p>
              <Button variant="outline" className="w-full" onClick={handleCreateCV}>
                <i className="fas fa-file-upload mr-2"></i>
                Upload & Enhance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-8">Why Choose CVMaster Pro?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <i className="fas fa-magic text-primary"></i>
              </div>
              <h4 className="font-medium">AI-Enhanced</h4>
              <p className="text-sm text-muted-foreground">
                Intelligent content suggestions and optimization
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <i className="fas fa-shield-alt text-accent"></i>
              </div>
              <h4 className="font-medium">ATS-Optimized</h4>
              <p className="text-sm text-muted-foreground">
                Designed to pass applicant tracking systems
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center mx-auto">
                <i className="fas fa-globe text-secondary-foreground"></i>
              </div>
              <h4 className="font-medium">Multi-Language</h4>
              <p className="text-sm text-muted-foreground">
                Support for 15+ languages and regions
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <i className="fas fa-download text-muted-foreground"></i>
              </div>
              <h4 className="font-medium">Easy Export</h4>
              <p className="text-sm text-muted-foreground">
                Download in PDF format, ready to send
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}