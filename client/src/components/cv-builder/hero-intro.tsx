import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HeroIntroProps {
  onGetStarted: () => void;
}

export function HeroIntro({ onGetStarted }: HeroIntroProps) {
  return (
    <div className="text-center space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <i className="fas fa-file-alt text-primary-foreground text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-foreground">CVMaster Pro</h1>
        </div>
        <h2 className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create professional CVs in minutes with AI-powered content enhancement and multi-language support
        </h2>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <Badge variant="secondary">
            <i className="fas fa-magic mr-1"></i>
            AI-Enhanced
          </Badge>
          <Badge variant="secondary">
            <i className="fas fa-globe mr-1"></i>
            Multi-Language
          </Badge>
          <Badge variant="secondary">
            <i className="fas fa-shield-alt mr-1"></i>
            ATS-Optimized
          </Badge>
        </div>
      </div>

      {/* Template Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Version */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Badge variant="outline">FREE</Badge>
          </div>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Standard Template</h3>
            <div className="bg-muted/50 rounded-lg p-4 mb-4 min-h-[300px] relative">
              {/* Watermark overlay for preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent"></div>
              <div className="space-y-3 relative">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                <div className="h-3 bg-muted-foreground/15 rounded w-1/2"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-2 bg-muted-foreground/10 rounded"></div>
                  <div className="h-2 bg-muted-foreground/10 rounded w-4/5"></div>
                  <div className="h-2 bg-muted-foreground/10 rounded w-3/5"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-muted-foreground/15 rounded w-2/3"></div>
                  <div className="h-2 bg-muted-foreground/10 rounded"></div>
                  <div className="h-2 bg-muted-foreground/10 rounded w-5/6"></div>
                </div>
              </div>
              {/* Watermark text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-primary/20 text-4xl font-bold transform rotate-12">
                  PREVIEW
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-muted-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                Basic template design
              </li>
              <li className="flex items-center text-muted-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                Standard formatting
              </li>
              <li className="flex items-center text-muted-foreground">
                <i className="fas fa-times text-destructive mr-2"></i>
                Watermarked preview only
              </li>
              <li className="flex items-center text-muted-foreground">
                <i className="fas fa-times text-destructive mr-2"></i>
                Limited customization
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Premium Version */}
        <Card className="relative overflow-hidden border-2 border-primary/20">
          <div className="absolute top-4 right-4">
            <div className="premium-badge px-3 py-1 rounded-full text-xs font-medium text-white">
              PREMIUM $9.99
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Templates</h3>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 mb-4 min-h-[300px] relative">
              <div className="space-y-3">
                <div className="h-4 bg-primary/30 rounded w-3/4"></div>
                <div className="h-3 bg-accent/25 rounded w-1/2"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-2 bg-primary/20 rounded"></div>
                  <div className="h-2 bg-primary/20 rounded w-4/5"></div>
                  <div className="h-2 bg-primary/20 rounded w-3/5"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-accent/25 rounded w-2/3"></div>
                  <div className="h-2 bg-primary/15 rounded"></div>
                  <div className="h-2 bg-primary/15 rounded w-5/6"></div>
                </div>
                {/* Premium indicators */}
                <div className="flex space-x-2 mt-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                </div>
              </div>
              {/* Professional badge */}
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="text-xs">
                  <i className="fas fa-star mr-1"></i>
                  Pro
                </Badge>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                50+ Professional templates
              </li>
              <li className="flex items-center text-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                15 Language support
              </li>
              <li className="flex items-center text-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                No watermarks
              </li>
              <li className="flex items-center text-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                Unlimited downloads
              </li>
              <li className="flex items-center text-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                AI content enhancement
              </li>
              <li className="flex items-center text-foreground">
                <i className="fas fa-check text-accent mr-2"></i>
                Custom color schemes
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-8">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-edit text-primary text-2xl"></i>
            </div>
            <h4 className="font-medium">1. Fill Your Information</h4>
            <p className="text-sm text-muted-foreground">
              Add your personal details, work experience, education, and skills through our guided forms
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-magic text-accent text-2xl"></i>
            </div>
            <h4 className="font-medium">2. AI Enhancement</h4>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes and enhances your content for maximum impact and ATS compatibility
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-download text-secondary-foreground text-2xl"></i>
            </div>
            <h4 className="font-medium">3. Download & Share</h4>
            <p className="text-sm text-muted-foreground">
              Preview, customize, and download your professional CV in PDF format
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-4">
        <Button 
          size="lg" 
          onClick={onGetStarted}
          className="text-lg px-8 py-3"
          data-testid="button-get-started"
        >
          <i className="fas fa-rocket mr-2"></i>
          Create Your CV Now - Free
        </Button>
        <p className="text-xs text-muted-foreground">
          Start with our free version • Upgrade to premium for $9.99 • No subscription required
        </p>
      </div>
    </div>
  );
}