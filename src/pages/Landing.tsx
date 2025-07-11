
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Bell, CreditCard, Calendar, FileText, Users, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DocuAlert</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign In</Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="bg-blue-100 text-blue-800 mb-6">Never Miss a Critical Expiry Again!</Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Manage Document
          <span className="text-blue-600"> Expiries</span> Like a Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          DocuAlert helps you track and manage expiry dates of critical documents, certificates, subscriptions, and more. 
          Get timely reminders and never let important documents expire again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
              Start Free Trial
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Hero Image Placeholder */}
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Passport</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Safe</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">94 days</p>
                <p className="text-sm text-gray-600">until expiry</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Domain</CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">14 days</p>
                <p className="text-sm text-gray-600">until expiry</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">SSL Cert</CardTitle>
                  <Badge className="bg-red-100 text-red-800">Critical</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">9 days</p>
                <p className="text-sm text-gray-600">until expiry</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your document expiries</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Privacy-First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mask sensitive data like PAN, Aadhaar numbers. Your privacy is our priority.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bell className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Smart Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get email and SMS reminders 7, 3, and 1 day before expiry dates.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Easy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add, edit, and organize all your documents in one secure place.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Auto Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access your documents across all devices with real-time synchronization.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>Perfect for individuals</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$1.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="text-sm text-gray-600">or $19/year (save 21%)</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Up to 20 documents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Email alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Data masking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Mobile app access</span>
                </div>
                <Link to="/register" className="block">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="hover:shadow-xl transition-shadow border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For power users and businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="text-sm text-gray-600">or $49/year (save 18%)</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Unlimited documents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Email & SMS alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Advanced data masking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Export & backup</span>
                </div>
                <Link to="/register" className="block">
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Never Miss an Expiry Again?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users who trust DocuAlert with their important documents.</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DocuAlert</span>
              </div>
              <p className="text-gray-400">Never miss a critical expiry again!</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DocuAlert. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
