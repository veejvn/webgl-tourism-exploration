'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';

const protectedRoutes = ['/explore', '/profile', '/dashboard'];
const authPages = ['/login', '/register'];

export function AuthHydration({ children }: { children: React.ReactNode }) {
  const { hydrate, isAuthenticated, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthPage = authPages.includes(pathname);

    if (isProtectedRoute && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (isAuthPage && isAuthenticated) {
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
