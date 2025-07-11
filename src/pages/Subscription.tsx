
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Calendar, TrendingUp, Star } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Subscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpgradeClick = (planType: string) => {
    toast({
      title: "Stripe Integration Required",
      description: `To upgrade to ${planType}, integrate Stripe payments in your production app.`,
    });
  };

  const handleManageSubscription = () => {
    toast({
      title: "Customer Portal",
      description: "In production, this would open the Stripe Customer Portal for subscription management.",
    });
  };

  const plans = [
    {
      name: 'Starter',
      price: '$1.99',
      yearlyPrice: '$19',
      description: 'Perfect for individuals',
      features: [
        'Up to 20 documents',
        'Email alerts',
        'Data masking',
        'Mobile app access',
        'Basic support'
      ],
      current: user?.planType === 'Starter',
      popular: false
    },
    {
      name: 'Pro',
      price: '$4.99',
      yearlyPrice: '$49',
      description: 'For power users and businesses',
      features: [
        'Unlimited documents',
        'Email & SMS alerts',
        'Advanced data masking',
        'Priority support',
        'Export & backup',
        'API access',
        'Custom categories'
      ],
      current: user?.planType === 'Pro',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage your DocuAlert subscription and billing</p>
        </div>

        {/* Current Subscription Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Current Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{user?.planType}</p>
                  <Badge className={user?.subscriptionStatus === 'pro' ? 'bg-blue-600' : ''}>
                    {user?.subscriptionStatus === 'trial' ? 'Trial' : 'Active'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-medium text-green-600">
                  {user?.subscriptionStatus === 'trial' ? 'Trial Active' : 'Active'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {user?.subscriptionStatus === 'trial' ? 'Trial Expires' : 'Next Billing'}
                </p>
                <p className="text-lg font-medium">
                  {user?.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            {user?.subscriptionStatus === 'trial' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-800 font-medium">Trial period active</p>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Your free trial will expire on {user?.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A'}. 
                  Choose a plan below to continue using DocuAlert.
                </p>
              </div>
            )}

            {user?.subscriptionStatus !== 'trial' && (
              <div className="mt-6 flex space-x-4">
                <Button onClick={handleManageSubscription}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Usage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-600">Select the plan that best fits your document management needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''} ${plan.current ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge className="absolute -top-3 right-4 bg-green-600 text-white">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <div className="text-sm text-gray-600">or {plan.yearlyPrice}/year (save up to 21%)</div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    {plan.current ? (
                      <Button className="w-full" variant="outline" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        onClick={() => handleUpgradeClick(plan.name)}
                      >
                        {user?.subscriptionStatus === 'trial' ? 'Start ' + plan.name + ' Plan' : 'Upgrade to ' + plan.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Billing Information</CardTitle>
            <CardDescription>Manage your payment methods and billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-gray-600">
                      {user?.subscriptionStatus === 'trial' ? 'No payment method on file' : 'Visa ending in 1234'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                  {user?.subscriptionStatus === 'trial' ? 'Add Payment Method' : 'Update'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Billing History</p>
                    <p className="text-sm text-gray-600">View all your past invoices and payments</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                  View History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Stripe Payment Processing</h3>
          <p className="text-sm text-blue-800">
            DocuAlert uses Stripe for secure payment processing. All transactions are encrypted and PCI compliant. 
            Taxes (GST/VAT) are automatically calculated based on your location during checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
