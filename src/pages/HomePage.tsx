import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/products/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Car, Wrench, Battery, Gauge, Filter, Loader2 } from 'lucide-react';
import { Product, Category } from '@/types';
import apiService from '@/services/api';
import { API_ENDPOINTS } from '@/config/api';

const categoryIcons: Record<string, React.ElementType> = {
  'auto-parts': Wrench,
  'car-accessories': Car,
  'tools-equipment': Wrench,
  'engine-parts': Wrench,
  'brake-system': Gauge,
  'batteries': Battery,
  'filters': Filter,
  'suspension': Car,
  'electrical': Gauge,
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catResponse, prodResponse] = await Promise.allSettled([
          apiService.get<{ success: boolean; data: Category[] }>(API_ENDPOINTS.CATEGORIES),
          apiService.get<{ success: boolean; data: Product[]; meta?: unknown }>(API_ENDPOINTS.PRODUCTS + '?per_page=4'),
        ]);

        if (catResponse.status === 'fulfilled' && catResponse.value?.data) {
          setCategories(Array.isArray(catResponse.value.data) ? catResponse.value.data : []);
        }
        if (prodResponse.status === 'fulfilled' && prodResponse.value?.data) {
          setProducts(Array.isArray(prodResponse.value.data) ? prodResponse.value.data : []);
        }
      } catch {
        // API not reachable - show empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug] || Car;
                return (
                  <Link key={category.id} to={`/search?category=${category.slug}`}>
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
          ) : (
            <p className="text-sm text-muted-foreground">No categories available yet</p>
          )}
        </section>

        {/* Featured Products */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Featured Parts</h2>
            <Link to="/search" className="text-sm text-primary">
              View all
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No products available yet. Connect your backend API to see products.
                </p>
              </CardContent>
            </Card>
          )}
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
