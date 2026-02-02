import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCard } from '@/components/products/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Car, Wrench, Battery, Gauge, Filter } from 'lucide-react';
import { Product, Category } from '@/types';

// Mock data - replace with API calls
const mockCategories: Category[] = [
  { id: 1, name: 'Engine Parts', slug: 'engine-parts', product_count: 124 },
  { id: 2, name: 'Brake System', slug: 'brake-system', product_count: 89 },
  { id: 3, name: 'Batteries', slug: 'batteries', product_count: 45 },
  { id: 4, name: 'Filters', slug: 'filters', product_count: 156 },
  { id: 5, name: 'Suspension', slug: 'suspension', product_count: 78 },
  { id: 6, name: 'Electrical', slug: 'electrical', product_count: 234 },
];

const mockProducts: Product[] = [
  {
    id: 1,
    vendor_id: 1,
    vendor_name: 'AutoParts Pro',
    name: 'High Performance Brake Pads - Front Axle Set',
    description: 'Premium ceramic brake pads for superior stopping power',
    price: 899.99,
    sale_price: 749.99,
    category_id: 2,
    category_name: 'Brake System',
    brand: 'Brembo',
    model_compatibility: ['BMW 3 Series', 'BMW 5 Series'],
    year_range_start: 2015,
    year_range_end: 2023,
    condition: 'new',
    sku: 'BRK-001',
    stock_quantity: 25,
    images: [{ id: 1, url: 'https://placehold.co/400x400/1a365d/ffffff?text=Brake+Pads', is_primary: true }],
    specifications: [{ key: 'Material', value: 'Ceramic' }],
    warranty_months: 24,
    is_active: true,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
  },
  {
    id: 2,
    vendor_id: 2,
    vendor_name: 'Motor Spares SA',
    name: 'Oil Filter - Multi-Vehicle Fit',
    description: 'Universal oil filter compatible with most vehicles',
    price: 149.99,
    category_id: 4,
    category_name: 'Filters',
    brand: 'Bosch',
    model_compatibility: ['Toyota Corolla', 'Honda Civic', 'VW Golf'],
    condition: 'new',
    sku: 'FLT-002',
    stock_quantity: 150,
    images: [{ id: 2, url: 'https://placehold.co/400x400/2d3748/ffffff?text=Oil+Filter', is_primary: true }],
    specifications: [{ key: 'Type', value: 'Spin-on' }],
    warranty_months: 12,
    is_active: true,
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
  },
  {
    id: 3,
    vendor_id: 1,
    vendor_name: 'AutoParts Pro',
    name: 'Car Battery 12V 60Ah',
    description: 'Reliable starting power for most passenger vehicles',
    price: 1299.99,
    sale_price: 1099.99,
    category_id: 3,
    category_name: 'Batteries',
    brand: 'Willard',
    model_compatibility: ['Universal'],
    condition: 'new',
    sku: 'BAT-003',
    stock_quantity: 30,
    images: [{ id: 3, url: 'https://placehold.co/400x400/1e40af/ffffff?text=Battery', is_primary: true }],
    specifications: [{ key: 'Voltage', value: '12V' }, { key: 'Capacity', value: '60Ah' }],
    warranty_months: 24,
    is_active: true,
    created_at: '2024-01-12',
    updated_at: '2024-01-12',
  },
  {
    id: 4,
    vendor_id: 3,
    vendor_name: 'Engine Masters',
    name: 'Spark Plug Set - 4 Pack',
    description: 'Iridium spark plugs for optimal engine performance',
    price: 459.99,
    category_id: 1,
    category_name: 'Engine Parts',
    brand: 'NGK',
    model_compatibility: ['Toyota', 'Honda', 'Mazda'],
    condition: 'new',
    sku: 'SPK-004',
    stock_quantity: 80,
    images: [{ id: 4, url: 'https://placehold.co/400x400/7c3aed/ffffff?text=Spark+Plugs', is_primary: true }],
    specifications: [{ key: 'Type', value: 'Iridium' }],
    warranty_months: 12,
    is_active: true,
    created_at: '2024-01-08',
    updated_at: '2024-01-08',
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  'engine-parts': Wrench,
  'brake-system': Gauge,
  'batteries': Battery,
  'filters': Filter,
  'suspension': Car,
  'electrical': Gauge,
};

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Header with Search */}
      <div className="bg-primary px-4 pb-6 pt-4 text-primary-foreground">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8" />
            <span className="text-xl font-bold">BayPro</span>
          </div>
          {user && (
            <span className="text-sm">Hi, {user.name.split(' ')[0]}!</span>
          )}
        </div>

        <Link to="/search">
          <div className="flex items-center gap-2 rounded-lg bg-background/10 px-4 py-3 backdrop-blur">
            <Search className="h-5 w-5 text-primary-foreground/70" />
            <span className="text-sm text-primary-foreground/70">
              Search for auto parts...
            </span>
          </div>
        </Link>
      </div>

      <div className="p-4">
        {/* Categories */}
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {mockCategories.map((category) => {
              const Icon = categoryIcons[category.slug] || Car;
              return (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="mb-2 rounded-full bg-primary/10 p-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-center text-xs font-medium leading-tight">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Featured Parts</h2>
            <Link to="/search" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Quick Actions for Non-logged in users */}
        {!user && (
          <section className="mb-6">
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold">Join BayPro Today</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Sign up to start buying or selling auto parts
                </p>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
