import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, MoreVertical, Package } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types';

// Mock products - replace with API call
const mockVendorProducts: Product[] = [
  {
    id: 1,
    vendor_id: 1,
    vendor_name: 'AutoParts Pro',
    name: 'High Performance Brake Pads - Front Axle Set',
    description: 'Premium ceramic brake pads',
    price: 899.99,
    sale_price: 749.99,
    category_id: 2,
    category_name: 'Brake System',
    brand: 'Brembo',
    model_compatibility: ['BMW 3 Series'],
    condition: 'new',
    sku: 'BRK-001',
    stock_quantity: 25,
    images: [{ id: 1, url: 'https://placehold.co/100x100/1a365d/ffffff?text=BP', is_primary: true }],
    specifications: [],
    is_active: true,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
  },
  {
    id: 2,
    vendor_id: 1,
    vendor_name: 'AutoParts Pro',
    name: 'Car Battery 12V 60Ah',
    description: 'Reliable starting power',
    price: 1299.99,
    sale_price: 1099.99,
    category_id: 3,
    category_name: 'Batteries',
    brand: 'Willard',
    model_compatibility: ['Universal'],
    condition: 'new',
    sku: 'BAT-003',
    stock_quantity: 0,
    images: [{ id: 2, url: 'https://placehold.co/100x100/1e40af/ffffff?text=BAT', is_primary: true }],
    specifications: [],
    is_active: true,
    created_at: '2024-01-12',
    updated_at: '2024-01-12',
  },
];

const VendorProducts: React.FC = () => {
  const products = mockVendorProducts;

  if (products.length === 0) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="My Products" />
        <div className="flex flex-col items-center justify-center p-8 pt-20">
          <Package className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No products yet</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Start selling by adding your first product
          </p>
          <Button asChild>
            <Link to="/vendor/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Products"
        rightAction={
          <Button size="sm" asChild>
            <Link to="/vendor/products/new">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Link>
          </Button>
        }
      />

      <div className="p-4 space-y-3">
        {products.map((product) => {
          const primaryImage = product.images.find((img) => img.is_primary)?.url || product.images[0]?.url;

          return (
            <Card key={product.id}>
              <CardContent className="flex gap-3 p-3">
                <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        R{(product.sale_price || product.price).toFixed(2)}
                      </span>
                      {product.stock_quantity === 0 ? (
                        <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {product.stock_quantity} in stock
                        </Badge>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/vendor/products/${product.id}/edit`}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VendorProducts;
