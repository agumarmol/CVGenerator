import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface PremiumFeaturesProps {
  sessionToken: string;
}

export function PremiumFeatures({ sessionToken }: PremiumFeaturesProps) {
  const [, setLocation] = useLocation();

  const handleUpgradeToPremium = () => {
    setLocation(`/checkout/${sessionToken}`);
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="premium-badge w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="fas fa-crown text-white text-sm"></i>
          </div>
          <span className="text-lg font-semibold text-gray-800">Premium Features</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3 mb-6">
          <li className="flex items-center space-x-3">
            <i className="fas fa-check text-accent text-sm"></i>
            <span className="text-sm text-gray-700">50+ Professional Templates</span>
          </li>
          <li className="flex items-center space-x-3">
            <i className="fas fa-check text-accent text-sm"></i>
            <span className="text-sm text-gray-700">Multi-language Support (15 languages)</span>
          </li>
          <li className="flex items-center space-x-3">
            <i className="fas fa-check text-accent text-sm"></i>
            <span className="text-sm text-gray-700">AI Content Enhancement</span>
          </li>
          <li className="flex items-center space-x-3">
            <i className="fas fa-check text-accent text-sm"></i>
            <span className="text-sm text-gray-700">Unlimited PDF Downloads</span>
          </li>
          <li className="flex items-center space-x-3">
            <i className="fas fa-check text-accent text-sm"></i>
            <span className="text-sm text-gray-700">ATS Optimization</span>
          </li>
          <li className="flex items-center space-x-3">
            <i className="fas fa-check text-accent text-sm"></i>
            <span className="text-sm text-gray-700">Custom Color Schemes</span>
          </li>
        </ul>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            $9.99 <span className="text-sm font-normal text-gray-600">one-time</span>
          </div>
          <p className="text-xs text-gray-600 mb-4">Lifetime access to all premium features</p>
          <Button 
            onClick={handleUpgradeToPremium}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all transform hover:scale-105"
            data-testid="button-upgrade-to-premium"
          >
            <i className="fas fa-crown mr-2"></i>
            Upgrade to Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
