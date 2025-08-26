import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ sessionToken }: { sessionToken: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Verify payment with backend
        await apiRequest("POST", "/api/verify-payment", {
          paymentIntentId: paymentIntent.id,
          sessionToken,
        });

        toast({
          title: "Payment Successful",
          description: "Premium features unlocked! Redirecting...",
        });

        setTimeout(() => {
          setLocation('/');
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
        data-testid="button-submit-payment"
      >
        {isProcessing ? "Processing..." : "Complete Purchase - $9.99"}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { sessionToken } = useParams<{ sessionToken: string }>();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionToken) return;

    apiRequest("POST", "/api/create-payment-intent", { sessionToken })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [sessionToken, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clientSecret || !sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Invalid checkout session</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Unlock premium CV features for a one-time payment</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>CVMaster Pro Premium</span>
              <span className="text-2xl font-bold text-primary">$9.99</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="font-medium mb-4">What's included:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  50+ Professional Templates
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  Multi-language Support (15 languages)
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  AI Content Enhancement
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  Unlimited PDF Downloads
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  ATS Optimization
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  Watermark Removal
                </li>
              </ul>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm sessionToken={sessionToken} />
            </Elements>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-2">
            <i className="fas fa-shield-alt text-accent"></i>
            <span>Secure payment powered by Stripe</span>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <i className="fab fa-cc-visa text-blue-600 text-xl"></i>
            <i className="fab fa-cc-mastercard text-red-500 text-xl"></i>
            <i className="fab fa-cc-paypal text-blue-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
