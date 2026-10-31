'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';

export function AuthHydration({ children }: { children: React.ReactNode }) {
  const { hydrate, isAuthenticated, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isLoading) return;
    
    // Prevent authenticated users from accessing login/register
    if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
      router.push('/map');
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
