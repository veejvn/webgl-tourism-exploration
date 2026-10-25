'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';

const protectedRoutes = ['/explore', '/profile', '/dashboard'];

export function AuthHydration({ children }: { children: React.ReactNode }) {
  const { hydrate, isAuthenticated, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Simplified auth check - only redirect on explore page if not authenticated
  useEffect(() => {
    if (isLoading) return;
    
    // Prevent authenticated users from accessing login/register
    if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
      router.push('/map');
      return;
    }
    
    // Check only for /explore routes
    if (pathname.startsWith('/explore') && !isAuthenticated) {
      const destinationId = new URLSearchParams(window.location.search).get('id');
      const redirectPath = destinationId ? `/explore?id=${destinationId}` : '/explore';

      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-lg font-semibold animate-pulse">Khởi tạo ứng dụng...</p>
      </div>
    );
  }

  return <>{children}</>;
}
