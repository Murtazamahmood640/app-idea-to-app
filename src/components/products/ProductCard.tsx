import React from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = product.images.find((img) => img.is_primary)?.url || product.images[0]?.url;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground">
              -{discountPercent}%
            </Badge>
          )}
          {product.stock_quantity === 0 && (
            <Badge variant="secondary" className="absolute right-2 top-2">
              Out of Stock
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <p className="mb-1 text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">
              R{(product.sale_price || product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                R{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
