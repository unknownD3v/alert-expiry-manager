
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, Calendar, TrendingUp, Plus, Eye, EyeOff } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Document {
  id: string;
  userId: string;
  documentName: string;
  documentType: string;
  expiryDate: string;
  description: string;
  isMasked: boolean;
  maskedData: string;
  originalData: string;
  daysUntilExpiry: number;
  status: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    expiringSoon: 0,
    critical: 0
  });

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/db.json');
      const data = await response.json();
      const userDocs = data.documents.filter((doc: Document) => doc.userId === user?.id) || [];
      
      // Calculate days until expiry and status
      const now = new Date();
      const processedDocs = userDocs.map((doc: Document) => {
        const expiryDate = new Date(doc.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        let status = 'active';
        if (daysUntilExpiry <= 3) status = 'critical';
        else if (daysUntilExpiry <= 14) status = 'expiring_soon';
        
        return { ...doc, daysUntilExpiry, status };
      });

      setDocuments(processedDocs);
      
      // Calculate stats
      const total = processedDocs.length;
      const expiringSoon = processedDocs.filter(doc => doc.status === 'expiring_soon').length;
      const critical = processedDocs.filter(doc => doc.status === 'critical').length;
      
      setStats({ total, expiringSoon, critical });
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    if (status === 'critical') {
      return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    } else if (status === 'expiring_soon') {
      return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Safe</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'critical') return 'border-l-red-500';
    if (status === 'expiring_soon') return 'border-l-yellow-500';
    return 'border-l-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your documents today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {user?.planType === 'Starter' ? `${stats.total}/20 used` : 'Unlimited'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">Within 14 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">Within 3 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.planType}</div>
              <p className="text-xs text-muted-foreground">
                {user?.subscriptionStatus === 'trial' ? 'Trial active' : 'Active'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>Your latest document expiry tracking</CardDescription>
                </div>
                <Link to="/documents">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.slice(0, 5).map((doc) => (
                    <div key={doc.id} className={`flex items-center justify-between p-4 border-l-4 ${getStatusColor(doc.status)} bg-gray-50 rounded`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{doc.documentName}</h4>
                          {getStatusBadge(doc.status, doc.daysUntilExpiry)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{doc.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Type: {doc.documentType}</span>
                          <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                          {doc.isMasked && (
                            <span className="flex items-center">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Masked
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {doc.daysUntilExpiry > 0 ? doc.daysUntilExpiry : 0}
                        </p>
                        <p className="text-sm text-gray-600">days left</p>
                      </div>
                    </div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                      <p className="text-gray-600 mb-4">Start by adding your first document to track its expiry date.</p>
                      <Link to="/documents">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Document
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Subscription Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/documents" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Document
                  </Button>
                </Link>
                <Link to="/subscription" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Plan</span>
                    <Badge className={user?.subscriptionStatus === 'pro' ? 'bg-blue-600' : ''}>
                      {user?.planType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="outline" className="text-green-600">
                      {user?.subscriptionStatus === 'trial' ? 'Trial' : 'Active'}
                    </Badge>
                  </div>
                  {user?.subscriptionExpiry && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Expires</span>
                      <span className="text-sm text-gray-600">
                        {new Date(user.subscriptionExpiry).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <Link to="/subscription" className="block">
                    <Button className="w-full mt-4" size="sm">
                      Manage Subscription
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
