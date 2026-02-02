import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { VendorStats } from '@/types';

// Mock stats - replace with API call
const mockStats: VendorStats = {
  total_sales: 156,
  total_revenue: 125450.0,
  total_products: 24,
  pending_orders: 5,
  monthly_sales: [
    { month: 'Oct', sales: 20, revenue: 15000 },
    { month: 'Nov', sales: 35, revenue: 28000 },
    { month: 'Dec', sales: 48, revenue: 42000 },
    { month: 'Jan', sales: 53, revenue: 40450 },
  ],
};

const VendorDashboard: React.FC = () => {
  const stats = mockStats;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `R${stats.total_revenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Sales',
      value: stats.total_sales.toString(),
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Products',
      value: stats.total_products.toString(),
      icon: Package,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders.toString(),
      icon: ShoppingCart,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        rightAction={
          <Button size="sm" asChild>
            <Link to="/vendor/products/new">
              <Plus className="mr-1 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`rounded-full p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" asChild className="h-auto py-4">
              <Link to="/vendor/products" className="flex flex-col items-center gap-2">
                <Package className="h-5 w-5" />
                <span className="text-xs">My Products</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4">
              <Link to="/vendor/sales" className="flex flex-col items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-xs">View Sales</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Sales</CardTitle>
              <Link
                to="/vendor/sales"
                className="flex items-center text-xs text-primary"
              >
                View all
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.monthly_sales.slice(-3).map((month) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{month.month} 2024</p>
                    <p className="text-xs text-muted-foreground">
                      {month.sales} orders
                    </p>
                  </div>
                  <span className="font-semibold text-success">
                    R{month.revenue.toLocaleString('en-ZA')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
