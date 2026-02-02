import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, X, Upload, Camera } from 'lucide-react';
import { ProductCondition, ProductSpecification, Category } from '@/types';

// Mock categories - replace with API call
const mockCategories: Category[] = [
  { id: 1, name: 'Engine Parts', slug: 'engine-parts' },
  { id: 2, name: 'Brake System', slug: 'brake-system' },
  { id: 3, name: 'Batteries', slug: 'batteries' },
  { id: 4, name: 'Filters', slug: 'filters' },
  { id: 5, name: 'Suspension', slug: 'suspension' },
  { id: 6, name: 'Electrical', slug: 'electrical' },
];

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [modelCompatibility, setModelCompatibility] = useState('');
  const [yearRangeStart, setYearRangeStart] = useState('');
  const [yearRangeEnd, setYearRangeEnd] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('new');
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [warrantyMonths, setWarrantyMonths] = useState('');
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([
    { key: '', value: '' },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setSpecifications((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !categoryId || !brand || !sku || !stockQuantity) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
      });
      return;
    }

    setIsLoading(true);

    try {
      // In real app, create FormData and send to API
      // const formData = new FormData();
      // formData.append('name', name);
      // images.forEach((image) => formData.append('images[]', image));
      // await apiService.uploadWithProgress(API_ENDPOINTS.VENDOR_PRODUCTS, formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Product Added',
        description: 'Your product has been listed successfully',
      });

      navigate('/vendor/products');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Add Product',
        description: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-24">
      <PageHeader title="Add Product" showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Images */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 6 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50">
                  <Camera className="mb-1 h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., High Performance Brake Pads"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Brembo"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  placeholder="e.g., BRK-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select value={condition} onValueChange={(val) => setCondition(val as ProductCondition)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pricing & Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (R) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price (R)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  placeholder="0.00"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Compatibility */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Vehicle Compatibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="compatibility">Compatible Models</Label>
              <Textarea
                id="compatibility"
                placeholder="Enter compatible models, one per line&#10;e.g., BMW 3 Series (F30)&#10;BMW 5 Series (F10)"
                rows={3}
                value={modelCompatibility}
                onChange={(e) => setModelCompatibility(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearStart">Year From</Label>
                <Input
                  id="yearStart"
                  type="number"
                  placeholder="e.g., 2015"
                  value={yearRangeStart}
                  onChange={(e) => setYearRangeStart(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearEnd">Year To</Label>
                <Input
                  id="yearEnd"
                  type="number"
                  placeholder="e.g., 2023"
                  value={yearRangeEnd}
                  onChange={(e) => setYearRangeEnd(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Property"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                />
                {specifications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSpecification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
              <Plus className="mr-1 h-4 w-4" />
              Add Specification
            </Button>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Dimensions (cm)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Length"
                  type="number"
                  value={dimensions.length}
                  onChange={(e) => setDimensions((d) => ({ ...d, length: e.target.value }))}
                />
                <Input
                  placeholder="Width"
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => setDimensions((d) => ({ ...d, width: e.target.value }))}
                />
                <Input
                  placeholder="Height"
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions((d) => ({ ...d, height: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty (months)</Label>
              <Input
                id="warranty"
                type="number"
                placeholder="e.g., 12"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Publish Product
        </Button>
      </form>
    </div>
  );
};

export default AddProductPage;
