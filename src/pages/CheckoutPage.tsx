import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, MapPin } from 'lucide-react';
import { z } from 'zod';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address_line1: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'Province is required'),
  postal_code: z.string().min(4, 'Postal code is required'),
});

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address form state
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'South Africa',
  });

  const [notes, setNotes] = useState('');

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlaceOrder = async () => {
    setErrors({});

    const validation = addressSchema.safeParse(address);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call - replace with actual PayFast integration
    try {
      // In real app, call your PHP backend to initiate PayFast payment
      // const response = await apiService.post(API_ENDPOINTS.CHECKOUT, {
      //   items: cart.items,
      //   shipping_address: address,
      //   notes,
      // });

      // Simulate success for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: 'Order Placed!',
        description: 'Redirecting to payment...',
      });

      clearCart();
      navigate('/orders');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Checkout Failed',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="animate-fade-in pb-40">
      <PageHeader title="Checkout" showBack />

      <div className="p-4 space-y-4">
        {/* Shipping Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={address.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="address_line1">Street Address</Label>
                <Input
                  id="address_line1"
                  value={address.address_line1}
                  onChange={(e) => handleAddressChange('address_line1', e.target.value)}
                />
                {errors.address_line1 && (
                  <p className="text-sm text-destructive">{errors.address_line1}</p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="address_line2">Apartment, Suite, etc. (optional)</Label>
                <Input
                  id="address_line2"
                  value={address.address_line2}
                  onChange={(e) => handleAddressChange('address_line2', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Province</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                />
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={address.postal_code}
                  onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                />
                {errors.postal_code && (
                  <p className="text-sm text-destructive">{errors.postal_code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={address.country} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Notes (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Special instructions for delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>
                    R{((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-16 left-0 right-0 border-t bg-card p-4">
        <div className="mx-auto max-w-lg space-y-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-lg text-primary">R{cart.total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Pay with PayFast
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
