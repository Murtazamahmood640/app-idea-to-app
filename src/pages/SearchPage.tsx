import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data - same as HomePage for now
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

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [condition, setCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const price = product.sale_price || product.price;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    const matchesCondition = condition === 'all' || product.condition === condition;

    return matchesSearch && matchesPrice && matchesCondition;
  });

  const handleApplyFilters = () => {
    const filters: string[] = [];
    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      filters.push(`R${priceRange[0]} - R${priceRange[1]}`);
    }
    if (condition !== 'all') {
      filters.push(condition.charAt(0).toUpperCase() + condition.slice(1));
    }
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setCondition('all');
    setActiveFilters([]);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Search" />

      <div className="p-4">
        {/* Search Bar */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search parts, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Price Range */}
                <div className="space-y-4">
                  <Label>Price Range</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={5000}
                    step={50}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear
                  </Button>
                  <Button className="flex-1" onClick={handleApplyFilters}>
                    Apply
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter}
                <X className="h-3 w-3 cursor-pointer" onClick={clearFilters} />
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count */}
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredProducts.length} products found
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
