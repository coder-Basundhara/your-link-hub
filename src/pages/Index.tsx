
import { useState } from 'react';
import { Plus, ExternalLink, Edit, Trash2, User, Heart, BookOpen, Share2, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: 'profile' | 'favorites' | 'books' | 'social' | 'work' | 'other';
  icon?: string;
}

const CATEGORY_CONFIG = {
  profile: { icon: User, label: 'Profile Links', color: 'bg-blue-500' },
  favorites: { icon: Heart, label: 'Favorites', color: 'bg-red-500' },
  books: { icon: BookOpen, label: 'Books & Reading', color: 'bg-green-500' },
  social: { icon: Share2, label: 'Social Media', color: 'bg-purple-500' },
  work: { icon: Github, label: 'Work & Projects', color: 'bg-orange-500' },
  other: { icon: ExternalLink, label: 'Other Links', color: 'bg-gray-500' }
};

const Index = () => {
  const [links, setLinks] = useState<Link[]>([
    {
      id: '1',
      title: 'Personal Portfolio',
      url: 'https://example.com/portfolio',
      description: 'My personal website and portfolio',
      category: 'profile'
    },
    {
      id: '2',
      title: 'GitHub Profile',
      url: 'https://github.com/username',
      description: 'My coding projects and contributions',
      category: 'work'
    },
    {
      id: '3',
      title: 'Favorite Recipe Blog',
      url: 'https://example.com/recipes',
      description: 'Amazing cooking recipes I love',
      category: 'favorites'
    },
    {
      id: '4',
      title: 'The Design of Everyday Things',
      url: 'https://example.com/book1',
      description: 'Great book about design principles',
      category: 'books'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'other' as Link['category']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive"
      });
      return;
    }

    const newLink: Link = {
      id: editingLink?.id || Date.now().toString(),
      title: formData.title,
      url: formData.url,
      description: formData.description,
      category: formData.category
    };

    if (editingLink) {
      setLinks(links.map(link => link.id === editingLink.id ? newLink : link));
      toast({
        title: "Success",
        description: "Link updated successfully"
      });
    } else {
      setLinks([...links, newLink]);
      toast({
        title: "Success",
        description: "Link added successfully"
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', url: '', description: '', category: 'other' });
    setEditingLink(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      category: link.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast({
      title: "Success",
      description: "Link deleted successfully"
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getLinksByCategory = (category: Link['category']) => {
    return links.filter(link => link.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Link Management System
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Organize all your important links in one place. Keep your profile links, favorites, reading lists, and more easily accessible.
          </p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setEditingLink(null)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Link
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter link title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Optional description"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: Link['category']) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingLink ? 'Update Link' : 'Add Link'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Link Categories */}
        <div className="grid gap-8">
          {Object.entries(CATEGORY_CONFIG).map(([categoryKey, config]) => {
            const categoryLinks = getLinksByCategory(categoryKey as Link['category']);
            const IconComponent = config.icon;
            
            return (
              <Card key={categoryKey} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    {config.label}
                    <Badge variant="secondary" className="ml-auto">
                      {categoryLinks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {categoryLinks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <IconComponent className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No links in this category yet</p>
                      <p className="text-sm">Click "Add New Link" to get started</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {categoryLinks.map((link) => (
                        <div
                          key={link.id}
                          className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {link.title}
                            </h3>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(link)}
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(link.id)}
                                className="h-8 w-8 p-0 hover:bg-red-100 text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {link.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openLink(link.url)}
                            className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            Open Link
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/80 backdrop-blur rounded-full shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{links.length}</div>
              <div className="text-sm text-gray-600">Total Links</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(CATEGORY_CONFIG).filter(cat => getLinksByCategory(cat as Link['category']).length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Active Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
