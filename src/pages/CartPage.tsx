import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Cart" />
        <div className="flex flex-col items-center justify-center p-8 pt-20">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Add some auto parts to get started
          </p>
          <Button asChild>
            <Link to="/search">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-40">
      <PageHeader title={`Cart (${cart.items.length})`} />

      <div className="p-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cart.items.map((item) => {
            const primaryImage =
              item.product.images.find((img) => img.is_primary)?.url ||
              item.product.images[0]?.url;
            const price = item.product.sale_price || item.product.price;

            return (
              <Card key={item.id}>
                <CardContent className="flex gap-3 p-3">
                  <Link to={`/product/${item.product.id}`}>
                    <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        R{(price * item.quantity).toFixed(2)}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.min(item.product.stock_quantity, item.quantity + 1)
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-16 left-0 right-0 border-t bg-card p-4">
        <div className="mx-auto max-w-lg space-y-3">
          {/* Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R{cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{cart.shipping === 0 ? 'Free' : `R${cart.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (15%)</span>
              <span>R{cart.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span className="text-lg text-primary">R{cart.total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
