import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VendorSale, OrderStatus } from '@/types';

// Mock sales - replace with API call
const mockSales: VendorSale[] = [
  {
    id: 1,
    order_id: 1,
    order_number: 'BP-2024-001',
    product_id: 1,
    product_name: 'High Performance Brake Pads',
    product_image: 'https://placehold.co/100x100/1a365d/ffffff?text=BP',
    quantity: 2,
    price: 749.99,
    total: 1499.98,
    status: 'shipped',
    customer_name: 'John Doe',
    created_at: '2024-01-20T10:30:00Z',
  },
  {
    id: 2,
    order_id: 2,
    order_number: 'BP-2024-002',
    product_id: 3,
    product_name: 'Car Battery 12V 60Ah',
    product_image: 'https://placehold.co/100x100/1e40af/ffffff?text=BAT',
    quantity: 1,
    price: 1099.99,
    total: 1099.99,
    status: 'delivered',
    customer_name: 'Jane Smith',
    created_at: '2024-01-18T14:00:00Z',
  },
  {
    id: 3,
    order_id: 3,
    order_number: 'BP-2024-003',
    product_id: 1,
    product_name: 'High Performance Brake Pads',
    product_image: 'https://placehold.co/100x100/1a365d/ffffff?text=BP',
    quantity: 1,
    price: 749.99,
    total: 749.99,
    status: 'pending',
    customer_name: 'Mike Johnson',
    created_at: '2024-01-22T09:15:00Z',
  },
];

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-warning text-warning-foreground',
  confirmed: 'bg-primary text-primary-foreground',
  processing: 'bg-primary text-primary-foreground',
  shipped: 'bg-primary text-primary-foreground',
  delivered: 'bg-success text-success-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
  refunded: 'bg-muted text-muted-foreground',
};

const VendorSales: React.FC = () => {
  const sales = mockSales;

  // Calculate totals
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = sales.length;
  const pendingOrders = sales.filter((s) => s.status === 'pending').length;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Sales" />

      <div className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-lg font-bold text-success">R{totalRevenue.toFixed(0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="text-lg font-bold">{totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold text-warning">{pendingOrders}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="h-14 w-14 overflow-hidden rounded-md bg-muted">
                  <img
                    src={sale.product_image}
                    alt={sale.product_name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-medium truncate">{sale.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.order_number} • {sale.customer_name}
                      </p>
                    </div>
                    <Badge className={statusColors[sale.status]}>
                      {sale.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Qty: {sale.quantity} × R{sale.price.toFixed(2)}
                    </p>
                    <span className="font-semibold text-success">
                      R{sale.total.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(sale.created_at).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorSales;
