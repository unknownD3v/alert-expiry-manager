
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Eye, EyeOff, Edit, Trash2, Search, Filter } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showMaskedData, setShowMaskedData] = useState<{[key: string]: boolean}>({});

  // Form state
  const [formData, setFormData] = useState({
    documentName: '',
    documentType: 'Personal',
    expiryDate: '',
    description: '',
    isMasked: false,
    originalData: ''
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
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const maskData = (data: string, type: string): string => {
    if (!data) return '';
    
    switch (type.toLowerCase()) {
      case 'pan':
        return data.replace(/^.{6}/, 'XXXXXX');
      case 'aadhaar':
        return data.replace(/(\d{4})-(\d{4})-(\d{4})/, 'XXXX-XXXX-$3');
      case 'passport':
        return data.replace(/^.{6}/, 'XXXXXX');
      default:
        // Generic masking - show only last 3 characters
        if (data.length > 3) {
          return 'X'.repeat(data.length - 3) + data.slice(-3);
        }
        return data;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check document limit for Starter plan
    if (user?.planType === 'Starter' && documents.length >= 20) {
      toast({
        title: "Document limit reached",
        description: "Upgrade to Pro for unlimited documents",
        variant: "destructive",
      });
      return;
    }

    const maskedData = formData.isMasked ? maskData(formData.originalData, formData.documentName) : '';
    
    const newDocument: Document = {
      id: Date.now().toString(),
      userId: user?.id || '',
      documentName: formData.documentName,
      documentType: formData.documentType,
      expiryDate: formData.expiryDate,
      description: formData.description,
      isMasked: formData.isMasked,
      maskedData,
      originalData: formData.originalData,
      daysUntilExpiry: 0,
      status: 'active'
    };

    // Calculate days until expiry
    const now = new Date();
    const expiryDate = new Date(formData.expiryDate);
    newDocument.daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (newDocument.daysUntilExpiry <= 3) newDocument.status = 'critical';
    else if (newDocument.daysUntilExpiry <= 14) newDocument.status = 'expiring_soon';

    setDocuments([newDocument, ...documents]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Document added successfully",
      description: "Your document has been added to the tracking system",
    });
  };

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
    setFormData({
      documentName: doc.documentName,
      documentType: doc.documentType,
      expiryDate: doc.expiryDate,
      description: doc.description,
      isMasked: doc.isMasked,
      originalData: doc.originalData
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocument) return;

    const maskedData = formData.isMasked ? maskData(formData.originalData, formData.documentName) : '';
    
    const updatedDocument: Document = {
      ...editingDocument,
      documentName: formData.documentName,
      documentType: formData.documentType,
      expiryDate: formData.expiryDate,
      description: formData.description,
      isMasked: formData.isMasked,
      maskedData,
      originalData: formData.originalData,
    };

    // Recalculate days until expiry
    const now = new Date();
    const expiryDate = new Date(formData.expiryDate);
    updatedDocument.daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (updatedDocument.daysUntilExpiry <= 3) updatedDocument.status = 'critical';
    else if (updatedDocument.daysUntilExpiry <= 14) updatedDocument.status = 'expiring_soon';
    else updatedDocument.status = 'active';

    setDocuments(documents.map(doc => doc.id === editingDocument.id ? updatedDocument : doc));
    setIsEditDialogOpen(false);
    setEditingDocument(null);
    resetForm();
    
    toast({
      title: "Document updated successfully",
      description: "Your document has been updated",
    });
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "Document has been removed from tracking",
    });
  };

  const resetForm = () => {
    setFormData({
      documentName: '',
      documentType: 'Personal',
      expiryDate: '',
      description: '',
      isMasked: false,
      originalData: ''
    });
  };

  const toggleDataVisibility = (docId: string) => {
    setShowMaskedData(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const getStatusBadge = (status: string) => {
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

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || doc.documentType === filterType;
    return matchesSearch && matchesFilter;
  });

  const documentTypes = ['Personal', 'Business', 'Domain', 'Hosting', 'Subscription', 'License', 'Certificate'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
            <p className="text-gray-600">
              Track and manage your document expiry dates
              {user?.planType === 'Starter' && (
                <span className="ml-2 text-sm">({documents.length}/20 documents used)</span>
              )}
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogDescription>
                  Add a new document to track its expiry date
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    value={formData.documentName}
                    onChange={(e) => setFormData({...formData, documentName: e.target.value})}
                    placeholder="e.g., Passport, PAN Card"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={formData.documentType} onValueChange={(value) => setFormData({...formData, documentType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Additional notes or description"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isMasked"
                    checked={formData.isMasked}
                    onCheckedChange={(checked) => setFormData({...formData, isMasked: checked})}
                  />
                  <Label htmlFor="isMasked">Mask sensitive data</Label>
                </div>
                
                {formData.isMasked && (
                  <div className="space-y-2">
                    <Label htmlFor="originalData">Document Number/Data</Label>
                    <Input
                      id="originalData"
                      value={formData.originalData}
                      onChange={(e) => setFormData({...formData, originalData: e.target.value})}
                      placeholder="e.g., ABCDE1234F"
                      type="password"
                    />
                    <p className="text-xs text-gray-500">
                      This will be masked for privacy (e.g., XXXXXX234F)
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Document</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {documentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className={`border-l-4 ${getStatusColor(doc.status)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold">{doc.documentName}</h3>
                    {getStatusBadge(doc.status)}
                    <Badge variant="outline">{doc.documentType}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(doc)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-sm">{doc.description || 'No description'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                    <p className="text-sm font-medium">{new Date(doc.expiryDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Days Until Expiry</p>
                    <p className={`text-lg font-bold ${
                      doc.status === 'critical' ? 'text-red-600' :
                      doc.status === 'expiring_soon' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {doc.daysUntilExpiry > 0 ? doc.daysUntilExpiry : 'Expired'}
                    </p>
                  </div>
                </div>
                
                {doc.isMasked && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Document Data</p>
                        <p className="font-mono text-sm">
                          {showMaskedData[doc.id] ? doc.originalData : doc.maskedData}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDataVisibility(doc.id)}
                      >
                        {showMaskedData[doc.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterType !== 'All' ? 'No matching documents' : 'No documents yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== 'All' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start by adding your first document to track its expiry date'
                  }
                </p>
                {!searchTerm && filterType === 'All' && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Document
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>
                Update your document information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editDocumentName">Document Name</Label>
                <Input
                  id="editDocumentName"
                  value={formData.documentName}
                  onChange={(e) => setFormData({...formData, documentName: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDocumentType">Document Type</Label>
                <Select value={formData.documentType} onValueChange={(value) => setFormData({...formData, documentType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editExpiryDate">Expiry Date</Label>
                <Input
                  id="editExpiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsMasked"
                  checked={formData.isMasked}
                  onCheckedChange={(checked) => setFormData({...formData, isMasked: checked})}
                />
                <Label htmlFor="editIsMasked">Mask sensitive data</Label>
              </div>
              
              {formData.isMasked && (
                <div className="space-y-2">
                  <Label htmlFor="editOriginalData">Document Number/Data</Label>
                  <Input
                    id="editOriginalData"
                    value={formData.originalData}
                    onChange={(e) => setFormData({...formData, originalData: e.target.value})}
                    type="password"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Document</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Documents;
