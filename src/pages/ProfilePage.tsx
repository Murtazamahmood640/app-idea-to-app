import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Store,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Profile" />
        <div className="flex flex-col items-center justify-center p-8 pt-20">
          <User className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Not logged in</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Login to access your profile
          </p>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: User, label: 'Edit Profile', path: '/profile/edit' },
    { icon: MapPin, label: 'My Addresses', path: '/profile/addresses' },
    { icon: CreditCard, label: 'Payment Methods', path: '/profile/payments' },
    { icon: Bell, label: 'Notifications', path: '/profile/notifications' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Profile" />

      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex items-center gap-1">
                <Store className="h-3 w-3 text-primary" />
                <span className="text-xs capitalize text-primary">{user.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50 ${
                    index !== menuItems.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Switch Role (if vendor) */}
        {user.role === 'vendor' && (
          <Card>
            <CardContent className="p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/vendor')}
              >
                <Store className="mr-2 h-4 w-4" />
                Go to Vendor Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
