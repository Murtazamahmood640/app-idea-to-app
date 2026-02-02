import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ChevronRight } from 'lucide-react';
import { Order, OrderStatus } from '@/types';

// Mock orders - replace with API call
const mockOrders: Order[] = [
  {
    id: 1,
    order_number: 'BP-2024-001',
    customer_id: 1,
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: 'High Performance Brake Pads',
        product_image: 'https://placehold.co/100x100/1a365d/ffffff?text=BP',
        quantity: 2,
        price: 749.99,
        total: 1499.98,
      },
    ],
    subtotal: 1499.98,
    shipping: 0,
    tax: 224.99,
    total: 1724.97,
    status: 'shipped',
    payment_status: 'paid',
    payment_method: 'PayFast',
    shipping_address: {
      name: 'John Doe',
      phone: '0821234567',
      address_line1: '123 Main Street',
      city: 'Johannesburg',
      state: 'Gauteng',
      postal_code: '2000',
      country: 'South Africa',
    },
    created_at: '2024-01-20T10:30:00Z',
    updated_at: '2024-01-21T14:00:00Z',
  },
  {
    id: 2,
    order_number: 'BP-2024-002',
    customer_id: 1,
    items: [
      {
        id: 2,
        product_id: 3,
        product_name: 'Car Battery 12V 60Ah',
        product_image: 'https://placehold.co/100x100/1e40af/ffffff?text=BAT',
        quantity: 1,
        price: 1099.99,
        total: 1099.99,
      },
    ],
    subtotal: 1099.99,
    shipping: 50,
    tax: 172.49,
    total: 1322.48,
    status: 'delivered',
    payment_status: 'paid',
    payment_method: 'PayFast',
    shipping_address: {
      name: 'John Doe',
      phone: '0821234567',
      address_line1: '123 Main Street',
      city: 'Johannesburg',
      state: 'Gauteng',
      postal_code: '2000',
      country: 'South Africa',
    },
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-18T16:30:00Z',
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

const OrdersPage: React.FC = () => {
  const orders = mockOrders;

  if (orders.length === 0) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="My Orders" />
        <div className="flex flex-col items-center justify-center p-8 pt-20">
          <Package className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
          <p className="text-center text-muted-foreground">
            Your order history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Orders" />

      <div className="p-4 space-y-3">
        {orders.map((order) => {
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          const firstItem = order.items[0];

          return (
            <Link key={order.id} to={`/orders/${order.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-md bg-muted">
                      <img
                        src={firstItem.product_image}
                        alt={firstItem.product_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{firstItem.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        R{order.total.toFixed(2)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
