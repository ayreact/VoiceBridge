import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuth } from '@/lib/auth';

const publicRoutes = ['/login', '/register', '/ivr-info', '/whatsapp-info'];

export const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showNavigation = isAuthenticated || isPublicRoute;

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && <Navigation />}
      <main className={showNavigation ? "pt-16" : ""}>
        <Outlet />
      </main>
    </div>
  );
};