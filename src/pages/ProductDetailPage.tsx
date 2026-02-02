import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product } from '@/types';

// Mock product - replace with API call
const mockProduct: Product = {
  id: 1,
  vendor_id: 1,
  vendor_name: 'AutoParts Pro',
  name: 'High Performance Brake Pads - Front Axle Set',
  description: 'Premium ceramic brake pads designed for superior stopping power and reduced brake dust. These high-performance pads are engineered for demanding driving conditions and provide excellent fade resistance.',
  price: 899.99,
  sale_price: 749.99,
  category_id: 2,
  category_name: 'Brake System',
  brand: 'Brembo',
  model_compatibility: ['BMW 3 Series (F30/F31)', 'BMW 5 Series (F10/F11)', 'BMW X3 (F25)'],
  year_range_start: 2015,
  year_range_end: 2023,
  condition: 'new',
  sku: 'BRK-001',
  stock_quantity: 25,
  images: [
    { id: 1, url: 'https://placehold.co/600x600/1a365d/ffffff?text=Brake+Pads+1', is_primary: true },
    { id: 2, url: 'https://placehold.co/600x600/2d3748/ffffff?text=Brake+Pads+2', is_primary: false },
    { id: 3, url: 'https://placehold.co/600x600/4a5568/ffffff?text=Brake+Pads+3', is_primary: false },
  ],
  specifications: [
    { key: 'Material', value: 'Ceramic Composite' },
    { key: 'Position', value: 'Front Axle' },
    { key: 'Pieces', value: '4' },
    { key: 'Includes Wear Sensor', value: 'Yes' },
  ],
  weight: 2.5,
  dimensions: { length: 15, width: 12, height: 8 },
  warranty_months: 24,
  is_active: true,
  created_at: '2024-01-15',
  updated_at: '2024-01-15',
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // In real app, fetch product by id
  const product = mockProduct;

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: 'Added to Cart',
      description: `${quantity}x ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="animate-fade-in pb-24">
      <PageHeader title="Product Details" showBack />

      {/* Image Gallery */}
      <div className="relative aspect-square bg-muted">
        <img
          src={product.images[currentImageIndex].url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {hasDiscount && (
          <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
            -{discountPercent}% OFF
          </Badge>
        )}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="secondary">{product.condition}</Badge>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="text-xl font-bold leading-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            by {product.vendor_name} • SKU: {product.sku}
          </p>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            R{(product.sale_price || product.price).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-lg text-muted-foreground line-through">
              R{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock_quantity > 0 ? (
            <Badge variant="outline" className="text-success border-success">
              In Stock ({product.stock_quantity} available)
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        {/* Benefits */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span>Free Shipping over R500</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>{product.warranty_months} Month Warranty</span>
          </div>
        </div>

        {/* Compatibility */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="mb-2 font-semibold">Compatibility</h3>
            <div className="flex flex-wrap gap-2">
              {product.model_compatibility.map((model) => (
                <Badge key={model} variant="secondary">
                  {model}
                </Badge>
              ))}
            </div>
            {product.year_range_start && product.year_range_end && (
              <p className="mt-2 text-sm text-muted-foreground">
                Year: {product.year_range_start} - {product.year_range_end}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">Description</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        {/* Specifications */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="mb-2 font-semibold">Specifications</h3>
            <div className="space-y-2">
              {product.specifications.map((spec) => (
                <div key={spec.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{spec.key}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
              {product.weight && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">
                    {product.dimensions.length} x {product.dimensions.width} x{' '}
                    {product.dimensions.height} cm
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 border-t bg-card p-4">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>

          <Button
            className="flex-1"
            onClick={handleBuyNow}
            disabled={product.stock_quantity === 0}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
